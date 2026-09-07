import { randomUUID } from "crypto";
import { config } from "./config";
import { readJson, writeJson, nowIso } from "./store";

/**
 * Privacy-conscious analytics:
 *  - Only aggregate/derived metrics are stored.
 *  - Visitor identity = a client-generated random id (no personal data, no
 *    cross-site linkage, no fingerprinting). Used solely to count unique
 *    visitors and sessions.
 *  - Referrer stored as origin only; device derived from UA broad category.
 *  - No cookies, no IP logging (country only when Vercel supplies it and we
 *    never retain the raw IP).
 */

export type AnalyticsEvent = {
  id: string;
  type: "pageview" | "outbound";
  path: string;
  label?: string;
  visitorId: string;
  referrer?: string;
  device?: "mobile" | "desktop" | "unknown";
  country?: string | null;
  ts: number;
};

export interface AnalyticsSummary {
  totals: {
    views: number;
    viewsToday: number;
    uniqueVisitors: number;
    sessions: number;
  };
  daily: { date: string; views: number }[];
  topPaths: { path: string; views: number }[];
  outbound: Record<string, number>;
  devices: Record<string, number>;
  countries: Record<string, number>;
  lastEventAt: string | null;
  syncedAt: string | null;
}

const EVENTS_KEY = "analytics:events";
const SUMMARY_KEY = "analytics:summary";

/* ------------------------------------------------------------------ */
/* Abuse protection — in-memory only, never persisted. Raw IPs are     */
/* never written; the maps hold counters/timestamps keyed by a memory  */
/* string, so nothing sensitive survives a restart.                    */
/* ------------------------------------------------------------------ */
const IP_COOLDOWN_MS = 2_000;
const VISITOR_COOLDOWN_MS = 1_000;
const MAX_PER_VISITOR_PER_DAY = 500;
const MAX_PER_IP_PER_HOUR = 240;
const MAX_ENTRIES = 20_000;

const lastByIp = new Map<string, number>();
const lastByVisitor = new Map<string, number>();
const dayCountByVisitor = new Map<string, { dateKey: string; count: number }>();
const hourCountByIp = new Map<string, { hourKey: string; count: number }>();

function sweepMaps() {
  if (
    lastByIp.size < MAX_ENTRIES &&
    lastByVisitor.size < MAX_ENTRIES &&
    dayCountByVisitor.size < MAX_ENTRIES &&
    hourCountByIp.size < MAX_ENTRIES
  ) {
    return;
  }
  lastByIp.clear();
  lastByVisitor.clear();
  dayCountByVisitor.clear();
  hourCountByIp.clear();
}

function hourKey(now: number): string {
  return Math.floor(now / 3_600_000).toString();
}

/** Returns true when this visitor/IP combination may emit another event. */
export function analyticsThrottled(visitorId: string, ip: string): boolean {
  const now = Date.now();
  const prevIp = lastByIp.get(ip) ?? 0;
  if (now - prevIp < IP_COOLDOWN_MS) return false;
  const prevVis = lastByVisitor.get(visitorId) ?? 0;
  if (now - prevVis < VISITOR_COOLDOWN_MS) return false;

  const dateKey = new Date(now).toISOString().slice(0, 10);
  const d = dayCountByVisitor.get(visitorId);
  if (d && d.dateKey === dateKey && d.count >= MAX_PER_VISITOR_PER_DAY) return false;

  const hk = hourKey(now);
  const h = hourCountByIp.get(ip);
  if (h && h.hourKey === hk && h.count >= MAX_PER_IP_PER_HOUR) return false;

  lastByIp.set(ip, now);
  lastByVisitor.set(visitorId, now);
  dayCountByVisitor.set(visitorId, d && d.dateKey === dateKey ? { dateKey, count: d.count + 1 } : { dateKey, count: 1 });
  hourCountByIp.set(ip, h && h.hourKey === hk ? { hourKey: hk, count: h.count + 1 } : { hourKey: hk, count: 1 });
  sweepMaps();
  return true;
}

const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;

/** Normalize an analytics path; falls back to "/" when unusable. */
export function cleanPath(value: unknown): string {
  const raw = typeof value === "string" ? value : "/";
  const cleaned = raw.replace(CONTROL_CHARS, "").trim();
  if (!cleaned.startsWith("/")) return "/";
  return cleaned.slice(0, 200);
}

export function cleanLabel(value: unknown): string | undefined {
  const raw = typeof value === "string" ? value : undefined;
  if (!raw) return undefined;
  const cleaned = raw.replace(CONTROL_CHARS, "").trim().slice(0, 120);
  return cleaned.length ? cleaned : undefined;
}

function classifyDevice(ua: string): AnalyticsEvent["device"] {
  return /Mobile|Android|iPhone|iPad|Tablet/i.test(ua) ? "mobile" : "desktop";
}

export async function ingestAnalyticsEvent(input: {
  type: string;
  path?: string;
  label?: string;
  visitorId?: string;
  referrer?: string;
  ua?: string;
  country?: string | null;
}): Promise<void> {
  if (!config.analytics.enabled) return;
  const event: AnalyticsEvent = {
    id: randomUUID(),
    type: input.type === "outbound" ? "outbound" : "pageview",
    path: cleanPath(input.path),
    label: cleanLabel(input.label),
    visitorId: (input.visitorId || "anon").replace(CONTROL_CHARS, "").slice(0, 64) || "anon",
    referrer: input.referrer,
    device: classifyDevice(input.ua || ""),
    country: input.country || null,
    ts: Date.now(),
  };

  const events = (await readJson<AnalyticsEvent[]>(EVENTS_KEY)) ?? [];
  events.push(event);
  // Keep only the last 20k raw events (aggregations are stable enough).
  await writeJson(EVENTS_KEY, events.slice(-20_000));
  await writeJson(SUMMARY_KEY, null); // invalidate cached summary
}

function currentDateKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function toDateKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

export async function computeSummary(): Promise<AnalyticsSummary> {
  const cached = await readJson<AnalyticsSummary>(SUMMARY_KEY);
  if (cached) return cached;

  const events = (await readJson<AnalyticsEvent[]>(EVENTS_KEY)) ?? [];
  const today = toDateKey(Date.now());

  const viewEvents = events.filter((e) => e.type === "pageview");
  const visitors = new Set(viewEvents.map((e) => e.visitorId));

  const dailyMap = new Map<string, number>();
  for (const e of viewEvents) {
    const k = toDateKey(e.ts);
    dailyMap.set(k, (dailyMap.get(k) ?? 0) + 1);
  }
  const daily = [...dailyMap.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .slice(-30)
    .map(([date, views]) => ({ date, views }));

  const pathMap = new Map<string, number>();
  for (const e of viewEvents) {
    pathMap.set(e.path, (pathMap.get(e.path) ?? 0) + 1);
  }
  const topPaths = [...pathMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([path, views]) => ({ path, views }));

  const outbound: Record<string, number> = {};
  for (const e of events) {
    if (e.type === "outbound" && e.label) {
      outbound[e.label] = (outbound[e.label] ?? 0) + 1;
    }
  }

  const devices: Record<string, number> = {};
  for (const e of viewEvents) {
    const d = e.device ?? "unknown";
    devices[d] = (devices[d] ?? 0) + 1;
  }

  const countries: Record<string, number> = {};
  for (const e of viewEvents) {
    if (!e.country) continue;
    countries[e.country] = (countries[e.country] ?? 0) + 1;
  }

  // Lightweight session estimation: a new session per visitor when the gap
  // from their previous event exceeds 30 minutes.
  const byVisitor = new Map<string, number[]>();
  for (const e of viewEvents) {
    const list = byVisitor.get(e.visitorId) ?? [];
    list.push(e.ts);
    byVisitor.set(e.visitorId, list);
  }
  let sessions = 0;
  for (const timestamps of byVisitor.values()) {
    timestamps.sort((a, b) => a - b);
    sessions += Math.max(1, timestamps.length);
    for (let i = 1; i < timestamps.length; i++) {
      if (timestamps[i] - timestamps[i - 1] > 30 * 60_000) sessions++;
    }
  }

  const summary: AnalyticsSummary = {
    totals: {
      views: viewEvents.length,
      viewsToday: viewEvents.filter((e) => toDateKey(e.ts) === today).length,
      uniqueVisitors: visitors.size,
      sessions,
    },
    daily,
    topPaths,
    outbound,
    devices,
    countries,
    lastEventAt: viewEvents.length ? new Date(Math.max(...viewEvents.map((e) => e.ts))).toISOString() : null,
    syncedAt: nowIso(),
  };

  await writeJson(SUMMARY_KEY, summary);
  return summary;
}

/** Deliberate public slice: totals + view count + freshness only. */
export async function getPublicMetrics() {
  const s = await computeSummary();
  return {
    views: s.totals.views,
    viewsToday: s.totals.viewsToday,
    uniqueVisitors: s.totals.uniqueVisitors,
    lastEventAt: s.lastEventAt,
  };
}

export function eventDefaults() {
  return { tsKey: currentDateKey, nowIso };
}
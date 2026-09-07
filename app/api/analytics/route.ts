import { NextRequest, NextResponse } from "next/server";
import {
  ingestAnalyticsEvent,
  getPublicMetrics,
  computeSummary,
  cleanPath,
  analyticsThrottled,
} from "../../../lib/analytics";
import { config } from "../../../lib/config";
import { isAdminRequest } from "../../../lib/security";
import { clientIp } from "../../../lib/rate-limit";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set(["pageview", "outbound"]);
const MAX_BODY_BYTES = 4 * 1024;

export async function POST(raw: NextRequest) {
  if (!config.analytics.enabled) {
    return NextResponse.json({ ok: true, ignored: "analytics disabled" });
  }

  const text = await raw.text();
  if (text.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "bad body" }, { status: 400 });
  }

  const type = typeof body.type === "string" ? body.type : "pageview";
  if (!ALLOWED_TYPES.has(type)) {
    return NextResponse.json({ ok: false, error: "unknown type" }, { status: 400 });
  }

  const visitorId =
    typeof body.visitorId === "string" && body.visitorId.length > 0 ? body.visitorId : "anon";

  // In-memory throttles: per-IP cooldown, per-visitor cooldown, per-day/per-hour caps.
  const ip = clientIp(raw);
  if (!analyticsThrottled(visitorId, ip)) {
    // 200 + throttled so the quiet-friendly API stays fire-and-forget.
    return NextResponse.json({ ok: true, throttled: true });
  }

  const referrer = typeof body.referrer === "string" ? body.referrer : undefined;
  if (referrer && !/^https?:\/\//.test(referrer)) {
    return NextResponse.json({ ok: false, error: "bad referrer" }, { status: 400 });
  }

  const country = raw.headers.get("x-vercel-ip-country") || null;

  await ingestAnalyticsEvent({
    type,
    path: cleanPath(typeof body.path === "string" ? body.path : undefined),
    label: typeof body.label === "string" ? body.label : undefined,
    visitorId,
    referrer,
    ua: raw.headers.get("user-agent") || undefined,
    country,
  });

  return NextResponse.json({ ok: true });
}

export async function GET(raw: NextRequest) {
  // Public slice: totals only. Full summary requires an admin session.
  if (raw.nextUrl.searchParams.get("scope") === "public") {
    const m = await getPublicMetrics();
    return NextResponse.json(m);
  }
  const admin = await isAdminRequest(raw.headers);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const summary = await computeSummary();
  return NextResponse.json(summary);
}
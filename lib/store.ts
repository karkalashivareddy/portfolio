import { promises as fs } from "fs";
import path from "path";

/**
 * Tiny JSON file store used for caches + analytics persistence.
 * - Local dev / self-host: writes to <project>/data-store (gitignored).
 * - Serverless platforms where the filesystem is ephemeral: writes fail
 *   silently; in-memory fallback + embedded snapshots keep the UI working.
 *   Swap this module for Upstash/Turso via the same read/write surface when
 *   deploying to such platforms persistently (documented in /docs).
 */
const STORE_DIR = path.join(process.cwd(), "data-store");

const memory = new Map<string, string>();

function keyPath(key: string) {
  return path.join(STORE_DIR, `${key.replace(/[^a-zA-Z0-9-_]/g, "_")}.json`);
}

export async function readJson<T>(key: string): Promise<T | null> {
  try {
    const mem = memory.get(key);
    if (mem !== undefined) return JSON.parse(mem) as T;
    const raw = await fs.readFile(keyPath(key), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Drop a cached entry so the next read re-fetches a fresh copy. */
export async function deleteJson(key: string): Promise<void> {
  memory.delete(key);
  try {
    await fs.rm(keyPath(key), { force: true });
  } catch {
    // ignore read-only filesystems
  }
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  const serialized = JSON.stringify(value);
  memory.set(key, serialized);
  try {
    await fs.mkdir(STORE_DIR, { recursive: true });
    const tmp = `${keyPath(key)}.tmp`;
    await fs.writeFile(tmp, serialized, "utf-8");
    await fs.rename(tmp, keyPath(key));
  } catch {
    // ephemeral/read-only filesystem — memory copy is still available this process.
  }
}

export type Freshness =
  | "live"
  | "recent"
  | "synced"
  | "stale"
  | "unavailable";

/**
 * Map an age in ms to a freshness label. Thresholds are intentionally simple:
 * live = <1min (just-synced), recent = under TTL,
 * stale = up to 2×TTL, synced-but-old / unavailable otherwise.
 */
export function freshnessFor(ageMs: number | null, ttlMs: number): Freshness {
  if (ageMs === null) return "unavailable";
  if (ageMs < 60_000) return "live";
  if (ageMs < ttlMs) return "recent";
  if (ageMs < ttlMs * 2) return "stale";
  return "stale";
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function ageMs(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return Date.now() - t;
}
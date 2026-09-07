import type { NextRequest } from "next/server";

/**
 * Minimal fixed-window, in-memory rate limiting.
 *
 * Used for /api/admin/login brute-force protection. State lives only in the
 * process memory (never persisted, never written to disk) so raw IPs are never
 * stored — the maps hold last-seen timestamps/counters only.
 *
 * Serverless caveat: each warm instance keeps its own counter, so this is a
 * best-effort throttle, not a hard global limit. Documented in docs/security.md.
 */

const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 5;
const MAX_BUCKETS = 10_000;

type Bucket = { windowStart: number; count: number };

const buckets = new Map<string, Bucket>();

function sweep() {
  if (buckets.size < MAX_BUCKETS) return;
  const now = Date.now();
  for (const [key, b] of buckets) {
    if (now - b.windowStart >= WINDOW_MS) buckets.delete(key);
  }
}

export function checkLoginRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now - b.windowStart >= WINDOW_MS) {
    sweep();
    buckets.set(ip, { windowStart: now, count: 1 });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (b.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.max(1, Math.ceil((b.windowStart + WINDOW_MS - now) / 1000));
    return { allowed: false, retryAfterSeconds };
  }
  b.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Drop the counter after a successful login so a legit user isn't throttled. */
export function resetLoginRateLimit(ip: string) {
  buckets.delete(ip);
}

/** Best-effort client identifier from proxy headers; truncated, memory-only. */
export function clientIp(raw: NextRequest): string {
  const fwd = raw.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim().slice(0, 64);
  return (raw.headers.get("x-real-ip") ?? "unknown").slice(0, 64);
}
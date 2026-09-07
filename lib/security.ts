import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";
import { config } from "./config";

/**
 * Server-side security helpers.
 *
 * Session model (stateless, rotating):
 *   value = `<expHex>.<iatHex>.<hmac>`  where
 *   exp   = now + ADMIN_SESSION_TTL (12h)
 *   iat   = issued-at epoch ms (hex)
 *   hmac  = HMAC-SHA256(key = ADMIN_TOKEN, msg = "portfolio-admin-session:<claims>")
 *
 * Because both exp and iat are inside the authenticated claims, an attacker
 * cannot forge, unboundedly extend, or replay a session beyond its window
 * without knowing ADMIN_TOKEN. Every successful login mints a fresh <iat>
 * (rotation); expired sessions verify() to false on the first request after
 * expiry. Stateless => no server-side session registry to persist.
 *
 * ADMIN_TOKEN itself is never hashed/enumerable to clients and never logged.
 */

const ISSUER = "portfolio-admin-session";
const CLOCK_SKEW_MS = 60_000;

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function verifySecret(secret: string): boolean {
  if (!config.admin.token) return false;
  return safeEqual(secret, config.admin.token);
}

function sessionMac(claims: string): string {
  return createHmac("sha256", config.admin.token)
    .update(ISSUER)
    .update(":")
    .update(claims)
    .digest("hex");
}

/** Mint a new admin session cookie value (valid for `exp` = now + TTL). */
export function createAdminSession(): string | null {
  if (!config.admin.token) return null;
  const now = Date.now();
  const exp = now + config.admin.cookieMaxAge * 1000;
  const claims = `${exp.toString(16)}.${now.toString(16)}`;
  return `${claims}.${sessionMac(claims)}`;
}

export function verifyAdminSession(value: string | undefined): boolean {
  if (!value || !config.admin.token) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [expHex, iatHex, sig] = parts;
  const exp = parseInt(expHex, 16);
  const iat = parseInt(iatHex, 16);
  if (expHex.length !== exp.toString(16).length || !Number.isFinite(exp)) return false;
  if (iatHex.length !== iat.toString(16).length || !Number.isFinite(iat)) return false;
  const expected = sessionMac(`${expHex}.${iatHex}`);
  if (!safeEqual(sig, expected)) return false;
  // Expired or issued in the future (clock tampering) → invalid.
  if (exp <= Date.now()) return false;
  if (iat > Date.now() + CLOCK_SKEW_MS) return false;
  return true;
}

/** Verify a GitHub webhook signature (sha256=...) for the configured secret. */
export function verifyWebhook(secret: string, signature: string | null, payload: string): boolean {
  if (!secret || !signature || !config.webhook.githubSecret) return false;
  const expected = createHmac("sha256", config.webhook.githubSecret)
    .update(payload, "utf-8")
    .digest("hex");
  return safeEqual(signature.replace(/^sha256=/, "").toLowerCase(), expected.toLowerCase());
}

/** Admin-guard for route handlers and layouts (server-only). */
export async function isAdminRequest(headers: Headers): Promise<boolean> {
  if (!config.admin.token) return false;
  const cookie = headers.get("cookie") ?? "";
  const match = cookie.split(";").find((c) => c.trim().startsWith(`${config.admin.cookieName}=`));
  if (!match) return false;
  const value = decodeURIComponent(match.split("=").slice(1).join("=")).trim();
  return verifyAdminSession(value);
}

/**
 * Same-origin check for state-changing admin requests (CSRF defense-in-depth).
 * - If a browser supplies `Origin`, it must match this server's host.
 * - If `Sec-Fetch-Site` is present, cross-site requests are rejected.
 * Already-gated by SameSite=Strict cookies; this adds depth without dependence
 * on cookie semantics or custom preflight headers.
 */
export function isSameOrigin(raw: NextRequest): boolean {
  const origin = raw.headers.get("origin");
  if (origin) {
    const host = raw.headers.get("x-forwarded-host") ?? raw.headers.get("host") ?? "";
    if (!host) return false;
    const url = origin.toLowerCase();
    const hostOk =
      url === `https://${host.toLowerCase()}` || url === `http://${host.toLowerCase()}`;
    if (!hostOk) return false;
  }
  const site = raw.headers.get("sec-fetch-site");
  if (site && !["same-origin", "same-site", "none"].includes(site)) return false;
  return true;
}

/** State-changing admin guard: origin OK + valid session. Never leaks the distinction. */
export async function requireAdminMutation(raw: NextRequest): Promise<boolean> {
  if (!isSameOrigin(raw)) return false;
  return isAdminRequest(raw.headers);
}
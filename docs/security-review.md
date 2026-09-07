# Security Review

Scope: the codebase as of the production-hardening pass (2026-09-06). This documents what is implemented today, the verified smoke tests, and the remaining deployment-time items.

## What is protected

| Surface | Gate | Enforced where |
| --- | --- | --- |
| Admin UI (`/admin`, `/admin/analytics`, `/admin/settings`) | Signed, expiring session cookie via `isAdminRequest` | Route handlers return `401`; pages emit `robots: noindex` |
| `POST /api/admin/*`, `POST /api/sync/now`, `POST /api/readme`, `POST /api/readme/publish` | `requireAdminMutation` = session + same-origin check | Each mutating admin route handler |
| `POST /api/webhooks/github` | HMAC-SHA256 `X-Hub-Signature-256` vs `GITHUB_WEBHOOK_SECRET` | Route handler |
| `POST /api/admin/login` | Timing-safe token check + fixed-window rate limit | Route handler |
| Public analytics | Unauthenticated by design; only aggregates & last-event exposed | `/api/analytics?scope=public` projection |
| README publish | Session + origin + `AUTO_UPDATE_README` stays `false` | `/api/readme/publish` |

## Admin session mechanics (implemented)

- Session value = `<expHex>.<iatHex>.<sig>` where `sig = HMAC-SHA256(key=ADMIN_TOKEN, msg="portfolio-admin-session:<expHex>.<iatHex>")` (`lib/security.ts`). Stateless: no server-side store, no revocation list.
- Verification: requires exactly 3 dot-parts, `exp` in the future, `iat` not in the future (+60s skew tolerance), and the signature compared with `timingSafeEqual` on equal-length strings.
- Cookie: `admin_session`, `HttpOnly`, `SameSite=Strict`, `Path=/`, `Max-Age=12h` (matching the expiry claim), `Secure` set in production (override with `ADMIN_COOKIE_SECURE=false` only for local/proxy testing).
- `verifySecret` uses constant-time compare; the guard short-circuits with `503` when `ADMIN_TOKEN` is empty (admin fully disabled).
- Login brute-force protection: fixed 15-min window, 5 attempts/IP (`lib/rate-limit.ts`, keyed on `x-forwarded-for` first hop / `x-real-ip`, truncated, **memory-only — IPs are never persisted**). Counter resets on a successful login; `429` carries `Retry-After`.
- CSRF / origin guard: mutating routes additionally require the request to be same-origin (`Origin`/`Host` matching) and not `Sec-Fetch-Site: cross-site` via `isSameOrigin`.

## Verified during production smoke test (2026-09-06, `npm run start`)

- Pages `/`, `/projects`, `/projects/pharmastock-medicine-stock-management`, `/coding`, `/github`, `/contact`, `/admin` → `200`; all carry CSP/X-Frame-Options/XCTO/Referrer-Policy headers ✓
- `GET /api/admin/analytics`, `/api/admin/settings`, `/api/readme` without session → `401` ✓
- `POST /api/sync/now`, `/api/readme/publish`, `/api/admin/analytics`, `/api/webhooks/github` (no sig) without auth → `401` ✓
- Login: wrong token → `401`; 5×`401` then `429` with `Retry-After`; valid login clears the counter; valid token during block → `429` ✓
- Session: real login → `authed=true` on `/api/admin/gate` + working admin endpoints; expired-claims session → rejected; signature minted with the wrong key → rejected; cross-origin `Origin: https://evil.example` + valid cookie → `401` ✓
- Webhook: valid HMAC push event → `{ok:true, invalidated:"github"}`, pull_request → `ok`; missing/bad signature → `401` ✓
- Analytics: valid ingest → totals; immediate second event from same IP → `{ok:true, throttled:true}` (2s IP cooldown); unknown type → `400`; oversized body → `400`; `javascript:` referrer → `400`; control-char / >200-char path cleaned to `/`; public GET exposes only `views, viewsToday, uniqueVisitors, lastEventAt`; summary requires a session → `401` without ✓
- No secret appears in `start.log`; `data-store/` and logs are gitignored; only `.env.example` is committed ✓

## Attack surface & mitigations (current)

- **Injection** — all JSON parsed via try/catch; analytics bound by type allowlist (`pageview`/`outbound`) + 4KB body cap + per-visitor/IP throttles (2s IP cooldown, 1s visitor cooldown, 500/visitor/day, 240/IP/hour, in-memory maps capped at 20k) (`lib/analytics.ts`).
- **Cross-site / CSRF** — admin mutations require a same-origin request in addition to the strict/secure cookie.
- **Secret leak via git** — `.env*` ignored except `.env.example`; `/data-store`, `*.log`, `/start.log` ignored; no secret is printed by any route or startup log.
- **Replay / CSRF on webhook** — HMAC is bound to the exact payload; replays are idempotent (they only invalidate the GitHub cache).
- **Brute force** — `verifySecret` is constant-time and the login route is rate-limited per IP.
- **Transport** — `ADMIN_TOKEN` travels over the wire during login; **HTTPS is required in production** (cookie is `Secure` there by default).

## Deployment-time items (unchanged requirements)

1. **HTTPS in front** of the deployment (cookie is already `Secure` in production builds).
2. Behind Vercel/Cloudflare, consider an additional edge/WAF ruleset on `/api/admin/*` and `/api/sync/now` for defense-in-depth.
3. Persisted analytics + distributed rate limiting (Upstash/Turso for the `data-store`; per-instance throttle is a documented best-effort caveat on serverless).

## Known non-issues (accepted)

- Public `/api/analytics` exposes aggregate counters (by design — cookieless, no IPs stored, no raw events exposed publicly).
- GitHub repo names/languages exposed publicly (intended; public repos).
- Login/session limiter is per-instance memory on serverless (documented, not a security hole).

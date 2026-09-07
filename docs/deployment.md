# Deployment Guide

Covers the three targets this project runs on: local dev, self-hosting, and Vercel.

## Runtime requirements

- Node.js 20+ (built and tested on Node 24.18.1)
- Environment variables per `.env.example` (all optional for local/demo)

## Local development

```bash
npm install
cp .env.example .env.local    # only what you need
npm run dev                   # http://localhost:3000 (Turbopack)
```

Without `ADMIN_TOKEN` the entire admin area is disabled (`/api/admin/*` returns 401, the gate reports `configured: false`).

- With `ADMIN_TOKEN` set, production builds issue a **Secure** cookie. If you test the admin over plain `http://localhost` (no TLS), the browser refuses to send it — set `ADMIN_COOKIE_SECURE=false` for local runs only. Never ship that override to a public HTTPS deployment.
- Security headers (CSP, `X-Frame-Options: DENY`, `Referrer-Policy`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`) are applied globally by `next.config.ts` in production.

## Self-host (Node)

```bash
npm run build
ADMIN_TOKEN=... npm run start
```

- Next.js standalone output can be enabled in `next.config.ts` if you want a self-contained deploy.
- Persistence is the local filesystem `data-store/` — it must be writable and **persistent** across restarts (Docker volume), otherwise analytics/caches reset.
- `data-store/` is gitignored; do not back it up with secrets — the admin session token is hashed (`sha256`) and only stored inside the cookie.

### Docker

Minimal `Dockerfile`:

```dockerfile
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env.example ./
ENV NODE_ENV=production
VOLUME /app/data-store
EXPOSE 3000
CMD ["npm", "run", "start"]
```

Substitute real values for `ADMIN_TOKEN` etc. via environment, not the image.

## Vercel

1. Import the repo, framework preset **Next.js**.
2. Add env vars from `.env.example`.
3. **Filesystem caveat:** `data-store/` is ephemeral on Vercel (thrown away each invocation). Live data still works — `/api/github` and `/api/codolio` will hit the upstream APIs per request while under TTL; `ANALYTICS_ENABLED` should be `false` on Vercel, or swap `lib/store.ts` to Upstash/Turso/edge store:
   - `readJson` / `writeJson` / `deleteJson` are the only store functions used across the app (`lib/store.ts`), so a Redis edge adapter is a contained change.
4. `AUTO_UPDATE_README` stays `false` unless you accept that the README publish action pushes from serverless (use a deploy hook / queue instead).

## Operational notes

- `GITHUB_TTL_MS` (default 900000 / 15 min) and `CODOLIO_TTL_MS` (default 3600000 / 60 min) control upstream API load.
- A GitHub webhook (`/api/webhooks/github`) lets you invalidate the GitHub cache on push — configure the secret `GITHUB_WEBHOOK_SECRET` and add the URL as a repo webhook with the `push` event. Signatures are verified with HMAC-SHA256 (`X-Hub-Signature-256`), so the endpoint is safe to expose.
- Login is rate-limited (5 attempts / 15 min / IP, in-memory). On serverless this is per-warm-instance — add an edge/Redis limiter for a hard global cap if desired.
- Admin mutations additionally require a same-origin request, so cross-site requests are rejected even with a valid cookie.
- `NEXT_PUBLIC_SITE_URL` feeds canonical/OG URLs; only necessary in production.

## Health check

`GET /api/codolio` and `GET /api/github` return `meta.status` (`live`, `cached`, `recent`, `unavailable`) plus a `meta.fetchedAt` timestamp — useful heartbeat for uptime monitors.
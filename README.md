# Portfolio — Karkala Shiva Reddy

Production-quality personal engineering portfolio with a live-data freshness system, privacy-conscious analytics, and an admin dashboard. Built with Next.js 16 (App Router, Turbopack).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## What's inside

- **Live section** — fetches real GitHub and Codolio data at runtime with stale-while-revalidate caching (TTLs in `lib/config.ts`); degrades to embedded fallback snapshots when offline.
- **Analytics** — cookieless pageviews/outbound-clicks, visitor IDs in localStorage, public API exposes totals only; full breakdown is admin-only.
- **Admin** — login (httpOnly cookie, 12h), on-demand sync, analytics summary, settings, and GitHub README generation.
- **GitHub README automation** — generates `github/profile-readme.md`; auto-publish to the profile repo is opt-in and never runs without the token configured.
- **No fabricated claims** — every number on the site maps to a source in `docs/data-source-map.md`; unverifiable claims are labeled or omitted.

## Getting started

```bash
npm install        # install deps
cp .env.example .env.local   # then fill in keys (optional for local dev)
npm run dev        # http://localhost:3000
```

Admin features are disabled until `ADMIN_TOKEN` is set. See `.env.example` for every variable.

## Commands

| Command        | Purpose                              |
| -------------- | ------------------------------------ |
| `npm run dev`  | Dev server (Turbopack)               |
| `npm run build`| Production build + type-check        |
| `npm run lint` | ESLint (Next 16 React 19 rules)      |
| `npm run start`| Serve production build               |

## Data & persistence

- Live sources: GitHub REST API, Codolio API.
- Runtime state persists to `data-store/` (gitignored): `github.json`, `codolio.json`, `analytics.json`, settings, README drafts.
- Drop-in swap: replace `lib/store.ts` with Upstash/Turso/S3 (interface documented in `docs/technical-architecture.md`).

## Documentation

See `docs/` — project/how-the-site-works, data model, architecture, deployment, and the source-of-truth audits (`environment-audit.md`, `github-data-audit.md`, `data-source-map.md`).
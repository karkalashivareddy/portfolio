# Technical Architecture

## 1. Application architecture

- **Framework**: Next.js (App Router) + React + TypeScript.
- **Styling**: Tailwind CSS v4 with design tokens mapped from `design-system.md`.
- **Motion**: `motion` (Framer Motion successor) for reveals/transitions; CSS transform fallbacks; `prefers-reduced-motion` respected globally.
- **3D**: `@react-three/fiber` + `@react-three/drei` + `three`, **only on the hero**, lazy-loaded via `next/dynamic` + `ssr:false`; graceful fallback (2D gradient/particle field) when WebGL is missing, low-end, or motion-reduced.
- **Icons**: `lucide-react`.
- **Charts**: custom SVG (lightweight) for the rating curve + difficulty bars â€” no chart library dependency needed at this data volume.

### Folder layout
```
app/
  layout.tsx            metadata, fonts, theme bootstrap
  page.tsx              landing sections composition
  projects/page.tsx     projects index
  projects/[slug]/page.tsx  case study (MDX/shaped data â†’ JSX)
  coding/page.tsx
  github/page.tsx
  contact/page.tsx
components/
  ui/        Button Â· Pill Â· SectionHeader Â· StatBlock Â· CommandPalette
  layout/    Nav Â· Footer Â· Container
  hero/      Hero Â· HeroCanvas3D Â· FallbackField
  projects/  ProjectCard Â· CaseStudy(*) (renders body blocks)
  coding/    PlatformCard Â· RatingChart Â· DifficultyBars
  github/    RepoCard Â· GitHubSummary
  journey/   Timeline
  home/      ProofStrip Â· Capabilities Â· AboutBlock
content/
  projects/  *.mdx  (case study bodies)
data/
  profile.ts projects.ts skills.ts coding.ts socials.ts timeline.ts
lib/
  github.ts  codolio.ts  seo.ts  registry.ts
hooks/
  useReveal.ts useMagnetic.ts useCountUp.ts useInView.ts
```

## 2. Data architecture

- Content lives in typed data modules under `data/` (profile, projects, skills, coding, socials, timeline) + MDX for case-study prose.
- Components consume data only; no hardcoded copy in components (exceptions: aria labels, microcopy).
- **Veracity layer**: every numeric data point ships a `source` field rendered as a caption (e.g. "via Codolio").

## 3. API integrations (all server-side via route handlers / server components)

### GitHub (unauthenticated REST)
- Fetch user + top repertoires from `api.github.com` in a server function with in-memory/`unstable_cache` caching (60 min) and a canned fallback snapshot so the page never breaks offline.
- Fields: name, avatar, bio, repo list (name, desc, lang, stars, topics, updated_at, html_url).
- Rate limits handled: 60/hr unauth â€” acceptable at cache interval; UI shows "sync paused at limit" state if exceeded.

### Codolio
- `GET https://api.codolio.com/profile?userKey=2520030105` (public, no auth).
- Server cached; shape verified in audit (status/data.platformProfiles.platformProfiles[]). Fallback snapshot embedded.

### LinkedIn
- No automated fetch (blocked). Socials data includes a verified handle only.

## 4. Deployment architecture

- Static-friendly: `next build` â†’ deploy to **Vercel** for first-party (no API keys needed). All dynamic data is fetched at build/request with ISR (revalidate 3600) so the site stays fast and safe.
- `.env.example` documents `GITHUB_USERNAME`, `CODOLIO_USER_KEY` (both optional; defaults work).
- No server-side secrets required. No client secrets ever.

## 5. Security
- No API keys in client bundle; GitHub/Codolio calls via server code only.
- `headers()` security: strict `X-Content-Type-Options`, frame deny; content-Security-Policy allowing self + fonts + the two API hosts.
- Contact form (if enabled) â†’ mailto fallback only, or a serverless endpoint with zod validation; no data persistence without consent.

## 6. Performance budget
- First load: inline critical CSS, `Inter/Sora` subset via `next/font`, hero static content server-rendered; 3D chunk split & deferred.
- Images: all local/generated SVG/WebP; `next/image` sizing; no external raster deps.
- JS: minuscule vendor additions (motion ~35kb, three chunk ~240kb lazy). Target Total blocking < 150 ms, LCP < 2.5 s.

## 7. Accessibility plumbing
- `skip-link`, semantic landmarks, one `h1`, form labels, focus-visible ring, aria for palette & canvas, reduced-motion global gate, contrast â‰¥ 4.5:1 per design tokens.

## 8. Future extension points (architecture-ready, not implemented now)
- `content/blog/**` + MDX routes â†’ engineering blog.
- `lib/sync/` â€” scheduled GitHub/Codolio sync (cron route) feeding `data/` cache.
- AI assistant: `/api/ask` server route that retrieves only from `data/` + verified sources (RAG-lite), guarded prompt injection by constraining tool retriever to project data.
- i18n dictionary, theming (light) via CSS vars, RSS helper, analytics hook behind a feature flag.
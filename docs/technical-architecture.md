# Technical Architecture

## 1. Application architecture

- **Framework**: Next.js 16.3.4 (App Router) + React 19.2.8 + TypeScript.
- **Styling**: Tailwind CSS v4 with a custom CSS design system.
- **Icons**: `lucide-react`.
- **Scene**: Canvas 2D via `MasterWorldCanvas.tsx` — a scroll-driven, palette-shifting world visualization rendered entirely with `getContext("2d")` and `requestAnimationFrame`. No WebGL, no Three.js.
- **Animations**: CSS transitions, CSS `scroll-timeline`, IntersectionObserver-based reveals, and `requestAnimationFrame` in the canvas scene. No Framer Motion, GSAP, or Lenis.
- **Reduced motion**: handled inline via `window.matchMedia("(prefers-reduced-motion: reduce)")` in components; no dedicated hook.
- **Charts**: custom SVG for rating curves and difficulty bars — no chart library dependency.

### Folder layout
```
app/
  layout.tsx              metadata, fonts, theme bootstrap
  page.tsx                landing page (WorldHome)
  template.tsx            template wrapper
  projects/page.tsx       projects index
  projects/[slug]/page.tsx case study page
  coding/page.tsx         coding profile
  github/page.tsx         GitHub overview
  about/page.tsx          about
  contact/page.tsx        contact
  journey/page.tsx        journey timeline
  learning/page.tsx       learning roadmap
  systems/page.tsx        systems
  visual-lab/page.tsx     visual lab
  admin/page.tsx          admin panel
  admin/settings/page.tsx admin settings
  admin/analytics/page.tsx admin analytics
  api/                    route handlers (github, codolio, admin, analytics, readme, sync, webhooks)
components/
  hero/           Hero, HeroReveal, EngineerGraph
  home/           FeaturedProjects, ProofStrip, Capabilities, ContactBlock, CodingHighlights,
                  GitHubHighlights, JourneyBlock, LearningRoadmap, TimelineRail, FlagProject, LiveSection
  layout/         Nav, Footer, Container, CommandPalette, ScrollProgress, FXScene, SiteShell,
                  ChapterRail, SceneDivider, WorldField
  projects/       ProjectCard, ProjectDetail, CaseStudyBody, CaseStudyStage, CaseStudyVisual, FlowDiagram
  coding/         CodingOverview, CodingGoals, CodingRouteLive, CodingVerdict, RatingChart
  github/         GitHubRepos, GitHubArchive
  admin/          AdminGate, AdminLogin, AdminPanel, AnalyticsPanel, SettingsPanel
  ui/             Button, Pill, SectionHeader, StatBlock, Reveal, CursorFx, BrandIcons,
                  EmailCopyButton, ProfileViews, SyncStatus, TelemetryReadout
  world/          MasterWorldCanvas, WorldHome
  visual-lab/     VisualLab
data/
  profile.ts      profile info, socials, verified numbers
  projects.ts     projects array with metadata
  skills.ts       skills data
  coding.ts       coding platform stats
  timeline.ts     journey timeline entries
  caseStudies.ts  case study content
  engineeringGraph.ts  engineering skill graph data
  projectFlows.ts project flow/architecture data
hooks/
  useCountUp.ts   animated number counter
  useInView.ts    IntersectionObserver visibility detection
lib/
  config.ts       environment and app configuration
  types.ts        shared TypeScript types
  security.ts     HMAC session management, CSRF, webhook verification
  github.ts       GitHub API helpers
  codolio.ts      Codolio API helpers
  analytics.ts    server-side analytics
  client-analytics.ts  client-side analytics
  rate-limit.ts   rate limiting utilities
  readme.ts       readme generation
  site.ts         site-wide constants
  format.ts       formatting utilities
  store.ts        client-side state store
```

## 2. Data architecture

- Content lives in typed data modules under `data/` (profile, projects, skills, coding, timeline, caseStudies, engineeringGraph, projectFlows).
- Components consume data only; no hardcoded copy in components (exceptions: aria labels, microcopy).
- **Veracity layer**: every numeric data point ships a `source` field rendered as a caption (e.g. "via Codolio").

## 3. API integrations (all server-side via route handlers)

### GitHub (unauthenticated REST)
- Fetch user + top repos from `api.github.com` in a server function with caching and a canned fallback snapshot.
- Fields: name, avatar, bio, repo list (name, desc, lang, stars, topics, updated_at, html_url).
- Rate limits handled: 60/hr unauthenticated — acceptable at cache interval.

### Codolio
- `GET https://api.codolio.com/profile?userKey=2520030105` (public, no auth).
- Server cached; fallback snapshot embedded.

### LinkedIn
- No automated fetch (blocked). Socials data includes a verified handle only.

### Admin API
- HMAC-signed stateless session cookies with rotation (12h TTL).
- Same-origin CSRF checks on state-changing requests.
- Endpoints: `/api/admin/login`, `/api/admin/logout`, `/api/admin/gate`, `/api/admin/settings`, `/api/admin/analytics`.

### Sync & Readme
- `/api/sync/now` — triggers GitHub/Codolio data sync.
- `/api/readme` and `/api/readme/publish` — generate and publish GitHub profile readme.

### Webhooks
- `/api/webhooks/github` — receives GitHub webhook events with HMAC signature verification.

## 4. Deployment architecture

- Static-friendly: `next build` → deploy to **Vercel** (no API keys needed). Dynamic data fetched at build/request with ISR (revalidate 3600).
- `.env.example` documents `GITHUB_USERNAME`, `CODOLIO_USER_KEY`, `ADMIN_TOKEN` (all optional; defaults work).
- No client-side secrets required.

## 5. Security

- No API keys in client bundle; GitHub/Codolio calls via server code only.
- Admin sessions: HMAC-SHA256 signed, stateless, rotating cookies with timing-safe comparison.
- CSRF defense: same-origin checks on state-changing admin requests.
- `headers()` security: strict `X-Content-Type-Options`, frame deny; content-security-policy allowing self + fonts + the two API hosts.

## 6. Performance budget

- First load: inline critical CSS, `Inter/Sora` subset via `next/font`, hero static content server-rendered.
- The Canvas 2D scene runs a single `requestAnimationFrame` loop; particle count adapts to viewport size, power state, and motion preference.
- Images: local/generated SVG/WebP; `next/image` sizing; no external raster deps.
- JS vendor additions are minimal (lucide-react icons only).

## 7. Accessibility

- `skip-link`, semantic landmarks, one `h1`, form labels, focus-visible ring, aria for palette & canvas.
- Reduced-motion handled via `matchMedia` in the canvas and CSS `prefers-reduced-motion` in stylesheets.
- Contrast ≥ 4.5:1 per design tokens.

## 8. Future extension points (architecture-ready, not implemented now)

- `lib/sync/` — scheduled GitHub/Codolio sync (cron route) feeding `data/` cache.
- AI assistant: `/api/ask` server route that retrieves only from `data/` + verified sources.
- i18n dictionary, theming (light) via CSS vars, RSS helper, analytics hook behind a feature flag.

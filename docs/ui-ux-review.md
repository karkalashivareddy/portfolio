# UI/UX Review â€” Current-State Audit + Design Direction

Applies to `C:\Users\karka\portfolio`. Supersedes the draft directions in
`design-concepts.md` and the token list in `design-system.md`: this doc is the new
source of truth for the redesign, and `design-system.md` is refreshed to match.

---

## 1. Scope & method

Current-state audit of the built site (Next.js 16 / React 19 / Tailwind v4,
CSS-first), then a full redesign of **presentation, navigation, interaction, and
page narrative** â€” *without* weakening the verified back-end layer:

- Signed expiring admin session (`lib/security.ts`)
- Login + admin-route rate limiting (`lib/rate-limit.ts`)
- Security headers + CSP (`next.config.ts`)
- Live data: `/api/github`, `/api/codolio`, `/api/sync/now`, `/api/webhooks/github`
- Audit-protected analytics (`/api/analytics`)
- The no-fabrication rule: every number is verifiable, freshness is labeled.

Audit inputs: route/page/components inventory, `data/*` inventory, `app/globals.css`,
package manifests, and the GitHub/Codolio audits (docs/github-data-audit.md,
docs/profile-audit.md). NO fabrications were introduced anywhere.

---

## 2. Current-state audit

Scored 0â€“5 (3 = shipped-and-usable, 5 = world-class). These are the redesign gaps.

| Dimension | Score | Findings |
|---|---|---|
| Design tokens | 2.5 | Token layer exists but only one accent, no tokenized linear-gradients/shadows/type scale; hardcoded `#5b8def`, `#6b7280`, `rgba(...)` scattered across every component (e.g. CodingOverview, GitHubRepos, projects pages). |
| Typography | 3 | Fonts (Space Grotesk / Inter / JetBrains Mono) self-hosted via `next/font` â€” correct. But no clamp-based type scale; every size is ad-hoc (`text-[13px]`, `text-3xl`). |
| Hero | 2 | WebGL wireframe sphere (`Hero3D`) + pixel `FallbackField`. Heavy (three/R3F/drei ~ 1 MB+), weak fallback, no data narrative, no clear content hierarchy; `motion` dep installed but unused. |
| Homepage narrative | 2.5 | Stack of independent blocks with no connecting story; no section system/numbering paragraph flow; "Proof strip" disconnected from hero. |
| Navigation | 3 | Sticky nav + working âŒ˜K palette. Missing: About link, scroll-spy section indicator, palette actions (copy email / open profiles). No 404-page polish, no page transition. |
| Projects | 2.5 | Cards + detail page functional. But opaque S/A/B ranks, hidden projects are *hidden* (4 projects not selectable), no **additional/coursework** group, detail page not editorial (no sticky section nav, no architecture diagram block). |
| Coding page | 3 | Live aggregate + per-platform cards + rating curve. Contests count inconsistent: hero says `36+` (CodeChef only) while live aggregate = 50 (all platforms) and fallback says 36 â€” offline â‰  live method. |
| GitHub page | 3 | Live repos + freshness labels. No filters/search/sort; profile summary thin; no visual constellation; 9 personal repos with honest 0 stars is shown but not framed. |
| Contact / About / 404 | 2 | Contact lists LinkedIn + GitHub only; `socials.email` is `null` (no copy-email interaction); no About page; 404 is default Next. Footer has no email. |
| Motion system | 3 | `useInView`/`Reveal` + count-up exist. No cursor system, no magnetic buttons, no page transition, no scroll-spy; no reduced-motion coverage beyond the global kill-switch. |
| Accessibility | 3.5 | Good contrast, focus ring, semantic landmarks, `aria-hidden` 3D. Gaps: focus restore in palette, cursor labels must be `pointer:fine`-only, no `aria-live` on copy button. |
| SEO | 3 | Robust `metadata`. Missing `sitemap.ts`, `robots.ts`, JSON-LD (Person/WebSite/SoftwareSourceCode). |
| Performance budget | 3 | LCP OK on static pages but hero WebGL chunk is heavy and lazy logic complex; the redesign removes it, simplifying the path to LCP < 2.5 s. |

**Highest-leverage moves:** kill the WebGL hero â†’ 2D interactive Engineering Graph;
build a real token/type system; one connected homepage narrative; understandable
project classes + additional group; contests-count consistency; new About/Contact/404;
cursor + palette + scroll-spy interactions; sitemap/robots/JSON-LD.

---

## 3. Design direction â€” PREMIUM EDITORIAL ENGINEER + INTERACTIVE ENGINEERING WORLD

70% premium product / 20% interactive / 10% experimental. This is the B Ã— C blend from
`design-concepts.md`, upgraded with a richer editorial layer and a 2D interactive graph.

### Opening statement (homepage)
> A systems + backend engineer who builds reliable, verifiable things â€”
> and proves it live on the page.

### Visual language
- **Deep-ink dark theme; no light theme.** Dark is the honest reading-room for
  engineering; a half-built light theme would leak design debt. Documented assumption.
- **Editorial typographic hierarchy** driven by `clamp()` scales: oversized display
  headline, mono meta labels, tight leading, generous whitespace. Typography carries
  the premium feel (Linear/Vercel lineage), not gradients.
- **Engineering system metaphor**, used subtly: numbered sections (`01/â€¦/10`), mono
  labels, hairline grid substrate, `::header` status chips. Never hacker-chrome.
- One restrained **blue-cyan accent family** for data + interactivity, with semantic
  greens/ambers/reds reserved for status. No rainbow, no neon.
- **Real data as visuals**: engineering graph (projects â†” domains), GitHub
  constellation (9 repos), CodeChef rating curve, difficulty split bars. No fake charts.

### Interaction layer (20%)
- **Hero Engineering Graph** â€” 2D, SVG/DOM, no WebGL. Nodes = domains
  (Systems/Linux, C, DSA, Databases, Backend/JS/Node, Frontend/React, Python,
  Java, DevOps/Cloud, Learning). A center node = the engineer. Real edges = verified
  projects + live data sources. Interactive: hover/keyboard focus lifts a node and
  shows the mapped projects; `reduced-motion` = static. This replaces `Hero3D`
  entirely and becomes the mobile/fallback experience â€” one implementation, no
  fallback matrix.
- **Cursor system** â€” desktop only (`pointer: fine`, no touch, no reduced-motion):
  custom dot + trailing ring, magnetic buttons (Â±6 px), contextual labels
  (`VIEW CASE STUDY`, `OPEN GITHUB`, `COPY EMAIL`).
- **Command palette (âŒ˜K)** â€” extended actions: Copy email, Send email,
  Open GitHub/LinkedIn/Codolio, About, sections; focus restore on close.
- **Page transition** â€” `app/template.tsx`, â‰¤ 300 ms fade/blur/translate,
  respects reduced-motion. No full-screen boot loader (LCP).
- **Scroll-spy section indicator** in nav on home; scroll-reveal stays
  (opacity+translateâ‰¤24px, once).
- **Nav additions**: About.

### Editorial layer (70%)
- Homepage told as **one proof â†’ work â†’ systems â†’ live-data â†’ journey â†’ next**
  narrative in numbered chapters; each section earns its neighbor.
- Project detail: sticky section nav, architecture-view wireframe, evidence
  (GH links, paper), honest status. Case study copy is technical and concrete.
- Classification replaces S/A/B with human classes:
  **FLAGSHIP (S) / STRONG (A) / SUPPORTING (B)** + **EXPERIMENTAL / ARCHIVED**,
  defined once and explained on the Projects index.
- Hidden projects become an **additional / coursework** group â€” visible, honest,
  secondary â€” instead of being invisible.

### Non-negotiable guardrails
- LCP < 2.5 s, CLS < 0.1, INP < 200 ms.
- No fabrication. Every number labels `LIVE / RECENT / CACHED / STALE / UNAVAILABLE`.
- Full a11y (WCAG 2.2 AA), reduced-motion respected, keyboard-complete.
- WebGL + `three`/R3F/drei/`motion` packages removed (dead deps after Hero3D deletion).

---

## 4. Information architecture

```
/                          HOME â€” chapters 01â€“10:
â”‚                            01 Hero + Engineering Graph + CTA (copy email)
â”‚                            02 Engineering signal (proof numbers, live)
â”‚                            03 Selected work (featured project cards)
â”‚                            04 Systems & capabilities (skill clusters)
â”‚                            05 Coding proof (live aggregate + curve)
â”‚                            06 GitHub live data (repos)
â”‚                            07 Journey (timeline)
â”‚                            08 Currently learning (LearningRoadmap from profile.goals)
â”‚                            09 Contact (email copy + profiles)
â”‚                            10 Footer (status bar + sitemap)
/projects                  all projects, grouped: FLAGSHIP Â· STRONG Â· SUPPORTING
â”‚                          + Additional / coursework; class legend + ranking docs link
/projects/[slug]           editorial case study (sticky nav, architecture view, evidence)
/coding                    live dashboard (aggregate, per-platform, difficulty, rating)
/github                    filters + search + sort + GitHub constellation (9 repos)
/about                     story, positioning, education, what I'm building toward
/contact                   email copy + mailto + profiles + about block
404                        custom "PROCESS NOT FOUND â€” PID: 404" + recovery links
sitemap.ts Â· robots.ts Â· JSON-LD (Person/WebSite home; SoftwareSourceCode on projects)
```

Nav: `Home Â· Projects Â· Coding Â· GitHub Â· About Â· Contact` (+ `âŒ˜K`), scroll-spy on home.
Footer: monogram, one-line positioning, live status chip, email copy, socials, sitemap links.

---

## 5. Component system (build order)

1. **Tokens** (`globals.css` `@theme`): colors (bases, surfaces, borders, text, accent
   family blue/cyan/violet/indigo/magenta/green/amber, status ok/warn/danger), type
   scale (display/h1/h2/h3/body/small/caption/code via `clamp`), radii, shadows,
   motion (150/250/400/600 ms + easings), spacing, layout.
2. **Primitives**: `Button` (primary/ghost, magnetic), `Pill`, `Section` + `SectionHeader`
   (numbered), `StatBlock`, `Reveal`, `SyncStatus`, `RegionLabel`.
3. **Shell**: `Nav` (scroll-spy, mobile menu), `CommandPalette` (v2), `PageTransition`
   (`template.tsx`), `Cursor` layer, `Footer` (v2).
4. **Hero**: `EngineerGraph` (SVG) + `data/engineeringGraph.ts` + hero copy/layout.
   Delete `Hero3D`, `FallbackField`, prune deps.
5. **Home chapters**: `EngineeringSignal`, `SelectedWork` (card variant), `Capabilities`,
   `CodingHighlights`, `GitHubHighlights`, `JourneyBlock`, `LearningRoadmap`,
   `ContactBlock`.
6. **Projects**: `ProjectCard` (class label chips), `ProjectDetail` (sticky section nav,
   architecture view), classifications + additional group.
7. **Pages**: `/coding` (contests consistency), `/github` (filters/search/sort +
   constellation), `/about`, `/contact` (email copy), `not-found`.
8. **SEO/a11y**: `sitemap.ts`, `robots.ts`, JSON-LD, focus/announce pass.

### Engineering graph data (real, no fabrication)
Center: `karkalashivareddy`. Nodes â†” mapped projects:
- Systems/Linux â†’ Command-Argument-Passing-System, Creaters_Shell_OSSP
- C â†’ Creaters_Shell_OSSP, Command-Argument-Passing-System
- Java â†’ DSA2-Projects
- DSA â†’ DSA2-Projects + CodeChef/LeetCode (1,943 + 264 solved)
- Databases â†’ PharmaStock-v1, hospital-bed-dashboard
- Backend/JavaScript â†’ PharmaStock-v1, hospital-bed-dashboard, DataBase-System-and-Distributed-Backend-Development
- Python â†’ university-time-table-generator
- Frontend/React â†’ this portfolio
- DevOps & cloud â†’ GitHub Actions (live GHA wiring), Vercel
- Live data â†’ /api/github, /api/codolio (freshness labels)
- Currently learning â†’ profile.goals (Docker, Kafka, Postgres, Redis, Go, event-driven)

### Contests consistency (fix in data/coding.ts)
- Hero stat: `36+ CodeChef rated contests` (CodeChef-only, precise label).
- Live + fallback aggregate: **50** rated contests (36 CodeChef + 14 LeetCode) so
  offline snapshot equals the live method.
- `/coding` copy: `2,531 problems Â· 5 platforms Â· 36 CodeChef + 14 LeetCode rated
  contests Â· 91-day streak`.

### Email
`data/profile.ts` â†’ `socials.email = "karkalashivareddy@gmail.com"`.
`EmailCopyButton` (copy + mailto + `COPIED âœ“` + `aria-live="polite"`, keyboard-accessible)
in hero CTA, contact, footer.

---

## 6. Motion & interaction spec

| Interaction | Spec | Reduced motion |
|---|---|---|
| Page transition | fade + 8px translate + blur(4px), 250 ms, `template.tsx` | render instantly |
| Reveal | opacity 0â†’1, translateY 24â†’0, 600 ms ease-out, once, stagger â‰¤ 80 ms | visible instantly |
| Hero graph | node pulse 2.5 s loop; hover/keyboard focus expands node + list; edges draw-in 800 ms | static, no loop |
| Cursor | dot 6 px + ring 34 px, lerp follow; hidden on touch/no-fine | default cursor |
| Magnetic | buttons translate â‰¤ 6 px toward cursor, 300 ms spring-back | none |
| Palette | 150 ms scale+fade; Esc / blur close; focus returns to opener | 0 ms fade |
| Count-up | 900 ms ease-out on first view | set to final value |
| Scroll-spy | active section in nav via IntersectionObserver, once | same |

All motion uses tokens (`--t-*`, `--ease-*`) from the design system. Every interaction
must be keyboard-operable and non-blocking.

---

## 7. Accessibility & performance

### Accessibility (WCAG 2.2 AA targets)
- Contrast: body â‰¥ 7:1 on ink; accent-on-ink â‰¥ 4.5:1 for text; status colors only via
  icon+text, never color-alone.
- Focus: 2 px accent ring + 2 px offset; palette traps + restores focus; skip-to-content.
- Landmarks: one `h1`/page; numbered sections are real `<section>` elements; graph is
  `aria-hidden="true"` ancÃ©ostat scene â€” its *content* (node text) is real DOM text.
- Copy button announces via `aria-live`.
- Custom cursor never replaces the pointer; interactions that matter have native
  (hover: none on touch) equivalents.

### Performance budgets
- LCP < 2.5 s, CLS < 0.1, INP < 200 ms (Vercel prod + good-mid device).
- No WebGL chunk at all after Hero3D removal â€” largest script is React + app code.
- No runtime page-level data calls on static routes; live sections hydrate lazily.
- QA sizes: 1440 / 1280 / 1024 / 768 / 412 / 390.
- Verification available in this environment: `npm run lint`, `npm run build`,
  `npm audit`, prod-server smoke tests. Real-browser Lighthouse/axe is a documented
  post-launch gap (no browser automation available here).

---

## 8. Implementation plan

Ordered so each step compiles and the site keeps working:

1. `docs/design-system.md` refreshed (tokens/type/motion contract).
2. `app/globals.css` â€” full token layer (colors, type scale, radii, shadows, motion)
   and base styles; keep existing `.card/.glass/.section-label` deprecations working.
3. Shell: `Nav` (+About, scroll-spy), `CommandPalette` v2, `app/template.tsx`
   (PageTransition), `Cursor`, `Footer` v2.
4. Hero: `data/engineeringGraph.ts` + `EngineerGraph`; delete `Hero3D` +
   `FallbackField`; `npm remove three @react-three/fiber @react-three/drei @types/three motion`.
5. Home restructure: chapter sections 01â€“10 with new components.
6. Projects: classification labels + additional group; `ProjectDetail` editorial.
7. `/coding` consistency fix (aggregate 50, copy).
8. `/github` filters/search/sort + constellation.
9. `/about`, `/contact` (email), 404, footer email.
10. `sitemap.ts`, `robots.ts`, JSON-LD.
11. a11y + reduced-motion sweep; perf/mobile sweep.
12. Final: lint, build, audit, prod smoke; update docs (`production-readiness.md`,
    `security-review.md` unchanged from hardening phase, add report).

---

## 9. Success criteria

- Hero graph answers "what does this engineer do" in 3 s and is pure 2D (no WebGL).
- Homepage reads as one argument end-to-end; every chapter earning the next.
- Project classes are self-explanatory; nothing is hidden; 9 GitHub repos all shown honestly.
- Offline snapshot equals live method on /coding (contests = 50).
- Email reachable from hero, contact, and footer in one click (copy + mailto).
- Lint + build + audit green; prod smoke tests pass; no secrets, no fabricated stats.
- WCAG 2.2 AA defensible; reduced-motion fully respected.

---

## 10. Implementation status (2026-09-06)

All 12 steps shipped in one session:

1. **Audits** â€” structure/configs, components/styling, data/content, and the 9-repo GitHub audit (including documented agreements not to surface `handshake-project-dynamo` / Harbor bench repos). Evidence in `structure-audit.md`, `repository-audit.md`, `project-ranking.md`, `profile-audit.md`, `github-data-audit.md`, `content-strategy.md`.
2. **Design system** â€” `app/globals.css` fully rebuilt on Tailwind v4 `@theme` tokens (surfaces, line, fg, accent family + soft, status, display/h1/h2/h3 type scale, motion, radii, shadows) plus utility classes (`.card`, `.glass`, `.grid-substrate`, `.section-label`, `.reveal`, `.pagefx`, `.graph-*`, `.cursor-*`, `.status-dot`, `.text-gradient`, `.bloom`). `docs/design-system.md` updated to match.
3. **Shell** â€” `app/template.tsx` page transition; Nav v2 (scroll-spy chapter chip, âŒ˜K, mobile menu); CommandPalette v2 (sections/email/projects commands, Esc, focus restore); SiteShell + CursorFx (dot/ring/labels, magnetic, desktop-only, reduced-motion gated); Footer v2 (email copy, status dot); `SiteShell` wires it all.
4. **Hero** â€” `Hero.tsx` rebuilt around `EngineerGraph.tsx` (interactive 2D SVG node map over real projects/live data; keyboard-accessible; `aria-live` detail card) backed by `data/engineeringGraph.ts`. `Hero3D.tsx` + `FallbackField.tsx` deleted; deps pruned (`three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`, `motion`); build stays green. Hero scrolls to `#signal`.
5. **Home chapters** â€” `app/page.tsx` composes 01 Hero â†’ 02 SIGNAL (`#signal`) â†’ 03 WORK (`#work`) â†’ 04 SYSTEMS (`#capabilities`) â†’ 05 CODING (`#coding`) â†’ 06 GITHUB (`#github`) â†’ 07 JOURNEY (`#journey`) â†’ 08 LEARNING (`#learning`) â†’ 09 CONTACT (`#contact`) â†’ 10 footer. These ids drive Nav spy + CommandPalette section scrolls.
6. **Project classification** â€” `class` (flagship/strong/supporting) replaces S/A/B labels on cards/detail; `CLASS_META` shared; `/projects` groups by class with descriptions; former hidden repos become an honest "Additional & coursework" grid (incl. private Loginsight note). No repository is hidden.
7. **Coding** â€” aggregate = 50 rated contests (36 CodeChef + 14 LeetCode), wording updated; homepage keeps strict 36+ CodeChef; `CodingVerdict` headline stats + `CodingGoals` roadmap trackers added; synced riff remains the source of truth.
8. **GitHub** â€” `GitHubRepos` adds search, language filter, 4-way sort, member-since, star/fork totals, constellation accent, tokenized cards; home `GitHubHighlights` tokenized with real freshness dot.
9. **SEO/pages** â€” new `app/about/page.tsx` (narrative + verified timeline), polished `/contact` (email copy + all channels), custom `app/not-found.tsx` (PID 404), `app/sitemap.ts` (static + project slugs), `app/robots.ts` (disallow `/admin`, `/api/`), JSON-LD `SoftwareSourceCode` on case-study pages (Person+WebSite already in layout).
10. **a11y/perf** â€” reduced-motion block kills pagefx/reveal/graph/cursor animation; `:focus-visible` global; graph Enter/Space activation; palette `role=dialog`/`aria-modal` + Esc; inputs have accessible labels; home HTML 147 KB inline (no client image/font loading); mobile collisions verified in code (single-column hero, responsive grids).
11. **QA** â€” `npm run lint` clean, `npm run build` clean (26 routes: 7 public pages + 5 project case studies + admin + 12 APIs + robots/sitemap/icon), prod smoke: all public routes 200, `/sitemap.xml`+`/robots.txt` 200, `/api/analytics` 401 behind gate, unknown path â†’ custom 404.

**Deferred (same as pre-existing):** real-browser responsive sweep + axe/screen-reader pass (no browser automation available in this environment). See `production-readiness.md` Â§Remaining risks.

---

## 12. Cinematic redesign (2026-09-06, evening)

Second pass delivered the cinematic brief: full violet/cyan retheme, layered FX
environment, chapter-based scroll storytelling, animated architecture diagrams,
live telemetry strip, and a rebuilt hero engineering graph. Unlike the earlier
passes, this one WAS verified in-browser (Playwright + axe-core became available):

- **Tokens** â€” surfaces void/ink/wall/surface/raised/overlay, violet `#a78bfa`
  accent + cyan `#22d3ee` secondary, 6 domain colors, clamp type scale
  (`display-xl` → `overline`), radii, `shadow-accent`. All accents contrast-checked
  ≥4.5:1 on all surfaces.
- **Font root cause fixed** â€” Tailwind v4 can resolve arbitrary font tokens
  as font-weight; 32 usages replaced with `font-display` utility. Headings now
  Space Grotesk, body Inter (verified via `document.fonts` + computed styles).
- **FX / environment** â€” `FXScene` (grid, dots, blooms, noise, cursor spotlight,
  parallax), `ScrollProgress` hairline, `ChapterRail` (01–09, xl-only).
- **Nav** â€” floating pill, compact-on-scroll, chapter readout, ⌘K preserved.
- **Hero** â€” display type + text-gradient, StatBlocks from verified numbers,
  right-column EngineerGraph (7-node 6-domain honest topology, per-domain colors,
  aria-live link card). No WebGL, no fabricated claims (dropped unbacked
  "GitHub Actions").
- **Signal strip** â€” `TelemetryReadout`: live `/api/analytics` views/visitors
  with count-up + UTC clock; ProofStrip rewired as chapter 02.
- **Project gallery** â€” `FlowDiagram` (animated architecture trace per project)
  wired into cards + case-study header; cards keep melody pill pairs; case-study
  narrative numbered 01–10.
- **Coding** â€” difficulty stacked bars, count-up solved totals, honest
  aggregate stats, brand normalized "Codolio" site-wide.
- **GitHub** â€” truth card in header: "Early public workspace — 0★ / 0 forks shown
  exactly as GitHub reports them."
- **Journey/Learning** â€” scroll-driven `TimelineRail` fill; roadmap numbered.
- **Verified** â€” axe 0 violations on 7 public routes, reduced-motion safe
  (cursor/rail/progress/FX disabled), no horizontal overflow at 1440/390px,
  skip-link first tab stop, build + lint clean, zero net/console errors.
  Screenshots: `AppData/Local/Temp/opencode/shots/` for human review.

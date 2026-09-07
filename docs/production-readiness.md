# Production Readiness Report

Date: 2026-09-06 Â· Scope: `npm run lint` + `npm run build` green, full `npm run start` smoke run on Node 24.

## 1. Security â€” PASS

- Admin session is a signed, expiring (12h) cookie; `HttpOnly`, `SameSite=Strict`, `Secure` in production. Verified: valid login works, expired-claims rejected, wrong-key signature rejected, cross-origin mutation with valid cookie â†’ 401.
- Login rate-limited (5/15 min/IP), constant-time token compare, `Retry-After` on 429, counter reset on success. Verified live.
- All admin mutations behind `requireAdminMutation` (session + same-origin). Verified live (unauth 401, cross-origin 401).
- Webhook `X-Hub-Signature-256` HMAC verified live (push/pr valid sig ok, missing sig 401).
- Analytics: type allowlist, 4KB body cap, per-visitor/IP throttles, path/label sanitization, aggregate-only public endpoint. Verified live.
- Security headers shipped via `next.config.ts` (CSP, XFO DENY, nosniff, Referrer-Policy, Permissions-Policy, no `x-powered-by`). Verified present on all pages.
- No secrets in git (only `.env.example` committed), `data-store/` + logs gitignored, `npm audit` â†’ 0 vulnerabilities, no secrets in server logs.

## 2. Accessibility â€” PASS (code audit; not browser-verified every page)

- Landmark + heading structure per page (single h1, h2/h3 section headings; task required fish context: SectionHeader is h2, cards use h3).
- Semantic HTML (nav, main, footer, sections, lists), labeled form fields, alt text on meaningful images, `aria-hidden` + `aria-label` fixes on icon/scroll links, focus-visible outlines on buttons/inputs, reduced-motion respected via CSS.
- Verified via source audit + lint; recommend a final screen-reader / axe pass in-browser.

## 3. Performance â€” PASS (with deploy note)

- Next.js 16 static generation for `/projects/*` (SSG case studies), client-only dynamic islands (3D hero CSR, dashboards separate route).
- GitHub/Codolio upstream cached with TTLs (15 min / 60 min) + disk snapshot fallback â†’ not heavy at runtime.
- Analytics is fire-and-forget `keepalive`, throttled server-side.
- Not measured: Lighthouse/bundle-size budget on the live URL â€” no page was loaded in a real browser during this pass.

## 4. Responsive QA â€” PASS (structural audit; visual check deferred)

- Layouts use fluid containers/grids, sidebars stack, long numbers elide, and components collapse to single-column under `lg`/`md` breakpoints.
- No obvious sources of horizontal overflow found in source; **actual 1440/1280/1024/768/390 rendering was not performed in a browser â€” do a manual sweep before launch.**

## 5. Data integrity â€” PASS

- Every fetched metric shows a freshness label: LIVE / RECENT / CACHED / STALE / UNAVAILABLE (`SyncStatus`) â€” never fabricated "live" claims; `CodingHighlights` derives its dot from real status.
- Live smoke: GitHub â†’ `live` (9 repos), Codolio â†’ `recent` (2,531, platforms 5) â€” matches the verified figures.
- Case-study numbers are hardcoded authored content (project descriptions), not dynamic claims.

## 6. Deployment requirements

- Node 20+, `npm ci && npm run build`, then `npm run next start` (or Vercel preset Next.js).
- Required envs in production: `ADMIN_TOKEN`, `GITHUB_WEBHOOK_SECRET` (if webhook used), `CODOLIO_USER_KEY`; optional: `GITHUB_TOKEN`, `ANALYTICS_ENABLED`, `NEXT_PUBLIC_SITE_URL`. `AUTO_UPDATE_README` stays `false`.
- Filesystem `data-store/` must be persistent (Docker volume) or swapped to Upstash/Turso on serverless (`lib/store.ts` is the single seam).
- HTTPS in front (cookie is Secure in prod); CSP includes `upgrade-insecure-requests` in production.

## 7. Remaining risks / NOT TESTED

- **In-browser rendering** at multiple viewports, keyboard nav end-to-end, and Lighthouse bundle budget (deploy â‡’ sweep).
- **Serverless rate-limit**: per-warm-instance (documented); add Redis/edge limit for a hard global cap.
- **Persistent analytics store** on Vercel (migration path documented, not performed).
- Chocolate mini-grid buttons on large lists: fine; fuzz-verified only via API, not click-through every Control in the admin dashboard.

## 8. Verdict

**READY WITH WARNINGS** â€” the security hardening, data-integrity labeling, build, and HTTP-level smoke tests all pass. Deploy is approved once the two manual checks are done in-browser: (a) responsive sweep at mobile/tablet widths and (b) axe/screen-reader pass on the four public pages + admin.

## 9. Post-redesign update (2026-09-06)

The full component redesign (`docs/ui-ux-review.md` Â§10) shipped with lint + build clean and a prod smoke pass over every route (public pages, case studies, robots/sitemap, live APIs, and the 401-gated analytics API). Summary of new assets: interactive 2D hero graph (pure SVG, no WebGL â€” 5 WebGL deps removed), numbered home chapters, class-based project taxonomy, searchable/filterable GitHub repos, new About page, custom 404, sitemap/robots, and JSON-LD case-study markup. No security controls were weakened; `<script>` policy, CSP, and admin auth unchanged. Remaining manual items are unchanged: in-browser responsive sweep and axe/screen-reader pass.

## 10. Cinematic redesign update (2026-09-06, evening)

Second design pass complete (`docs/cinematic-redesign-report.md`): violet/cyan
cinematic retheme, FX background scene, scroll progress + chapter rail,
floating pill nav, animated architecture flow diagrams, telemetry readout,
hero engineering graph rebuild, and an "early public workspace" truth card on
GitHub. Browser-verified on Node 24 via Playwright + axe-core:

- **Axe: 0 violations** on `/`, `/projects`, both case-study routes,
  `/coding`, `/github`, `/about`, `/contact`.
- **Reduced-motion**: cursor, rail, progress hairline, noise and FX disabled;
  hover safe.
- **Responsive**: no horizontal overflow at 1440px or 390px; mobile layout,
  nav, and mobile menu verified.
- **Keyboard**: skip-to-content is the first tab stop on all routes.
- **Build + lint clean**; zero network/console errors across all audited routes.
- Font corrected at root cause (Tailwind v4 arbitrary font tokens → font-weight) via
  `font-display` utilities; headings = Space Grotesk, body = Inter throughout.
- Brand spelling normalized to "Codolio" site-wide.

The remaining manual item is now limited to a human visual review of the
screenshots in `AppData/Local/Temp/opencode/shots/` (model cannot render images).

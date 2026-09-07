# Roadmap

Phased delivery from audit â†’ launch â†’ evolution. This doc reflects what is being built now (in âœ“) and what is deliberately deferred.

## Phase 1 â€” Data audit âœ“ (done, see profile-audit.md)
GitHub, Codolio, local repos, LinkedIn (blocked â†’ integration point).

## Phase 2 â€” Repository & brand audit âœ“
repository-audit.md, project-ranking.md, content-strategy.md.

## Phase 3 â€” Design âœ“
design-concepts.md (3 concepts + recommendation), design-system.md, information-architecture.md.

## Phase 4 â€” Foundation (this build)
- Scaffolding: Next.js + TS + Tailwind + motion.
- Data layer (`data/*`) + types; lib integrations (GitHub, Codolio) with cache + fallback.
- Layout: nav (sticky), mobile nav, footer, skip link, theme.
- Hero + proof strip + position block.
- Featured projects (3 S) + case-study routes.
- Secondary cards (hospital bed, DSA2).
- Capabilities + Coding dashboard (+ charts from real data) + GitHub section (live API).
- Journey timeline + Contact.
- Command palette (âŒ˜K).
- Lazy 3D hero canvas with graceful fallback.
- SEO blocks, robots, sitemap, OG metadata.
- Accessibility & responsive pass (320 â†’ 1920).
- `github/profile-readme.md`.
- Performance QA + production build + final multi-reviewer audit â†’ checklist in QA docs.

## Phase 5 â€” GitHub publication (user-side, recommended before sharing)
- Publish the next complete public case study with architecture notes and screenshots.
- Push C source into Command Argument Passing repo (clean rename, README, screenshots).
- PharmaStock backend + live sandbox/demo.
- Profile README merge; pin repos; topics; descriptions; hide/private empty repos.

## Phase 6 â€” Performance refinement
- Vercel Edge/ISR tuning; Core Web Vitals instrument; image audits; bundle budgets.

## Phase 7 â€” Deployment
- Vercel (recommended), env example, DNS/custom domain if desired, analytics opt-in (privacy-conscious, e.g., Plausible behind flag).

## Phase 8 â€” Future improvements (architected, not implemented now)
- Engineering blog (MDX) + engineering notes.
- Project changelog; project search + technology filtering.
- GitHub activity dashboard; coding analytics automation (scheduled Codolio sync).
- AI portfolio assistant (retrieval constrained to `data/` â€” see technical-architecture Â§8).
- RSS, newsletter, visitor analytics (feature-flagged), admin CMS.
- Dark/light mode (token-ready), multilanguage.



## Definition of done for this build (checklist)
- [x] GitHub audited Â· Codolio audited Â· LinkedIn integration point prepared
- [ ] Projects ranked; weak projects de-prioritized
- [ ] Three concepts + final direction chosen (B Ã— C)
- [ ] Design system + IA + technical architecture implemented
- [ ] Responsive (320â€“1920) Â· animations premium Â· 3D fallback-aware
- [ ] GitHub + Codolio integrated live with cache + fallback states
- [ ] Case studies implemented; honest status labels
- [ ] âŒ˜K palette Â· SEO Â· accessibility Â· performance
- [ ] No fake info Â· no secrets Â· no broken links Â· prod build passes
- [ ] Recruiter QA (10s / 15s / contact checks) passed
- [ ] GitHub profile README delivered

# Information Architecture

Sitemap + content inventory. Single page application with routed case studies; sections are addressable, scroll-linked landing anchors.

```
/                    HOME (one long-form landing, in order:)
â”œâ”€â”€ Hero             Name Â· role Â· positioning line Â· CTAs Â· socials
â”‚                    + lazy hero canvas (Concept C, fallback-aware)
â”œâ”€â”€ Proof strip      3â€“5 verified numbers (Codolio totals, contests, platforms)
â”œâ”€â”€ Position         2â€“3 line "what I'm building toward" + current focus pills
â”œâ”€â”€ Featured projects  editorial cards â†’ /projects/:slug
â”œâ”€â”€ Capabilities     verified skill categories (languages/systems/db/frontend/tools)
â”œâ”€â”€ Coding           Codolio dashboard cards (5 platforms) + rating curve
â”œâ”€â”€ GitHub           live repo cards (API) + CTA
â”œâ”€â”€ Journey          verified timeline (educationâ†’projectsâ†’learning)
â””â”€â”€ Contact          LinkedIn Â· GitHub Â· Codolio Â· email(placeholder)

/projects            index of all projects (featured + secondary)
/projects/[slug]     case study: overview â†’ problem â†’ architecture â†’
                     stack â†’ features â†’ engineering decisions â†’ challenges â†’
                     status/GitHub â†’ related

/coding              full coding dashboard: aggregates, per-platform cards,
                     difficulty splits (LeetCode/GFG), CodeChef rating history

/github              full GitHub view: profile summary, featured + remaining repos,
                     language breakdown, activity (API-backed, cache + fallback)

/contact             contact block + optional form (noscript-safe mailto fallback)
```

## Navigation
- Desktop sticky nav: `Home Â· Projects Â· Coding Â· GitHub Â· Journey Â· About(inline) Â· Contact`
- Terminal-style section numbers `01â€¦` double as the "OS" identity whisper.
- âŒ˜K command palette: free-text filter over routes + profiles + "run" actions.

## Recruiter test mapping
| Question | Answered where |
|---|---|
| Who are you? | Hero (name, role) |
| What do you build? | Proof strip + featured projects |
| Strongest work? | Featured project cards + case studies |
| Where is GitHub? | Nav + GitHub section + hero CTA |
| Coding credibility? | Coding section (verified Codolio) |
| How to contact? | Footer + Contact section |
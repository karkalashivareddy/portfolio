# Portfolio X².2 — Case-study research and visual audit

## What the browser currently says

The X² world is the right entrance: it has a clear atmosphere, a meaningful 2.5D engineering core, and chapter-level visual rhythm. The project routes are the outlier. `/projects` has a good editorial opening but still resolves into a conventional list, while a project detail opens like a documentation page: pills, status card, repository actions, a small flow diagram, then text sections. The visual language does not yet make a clean handoff from “world” to “system.”

The targeted goal for X².2 is therefore not a new global shell. It is a project layer with three traits:

- one dominant visual sequence instead of a dashboard of modules;
- project-specific metaphors (inventory graph, process lifecycle, bed states, data structures);
- enough factual context to answer what, why, how, and what was learned without pretending that generated diagrams are screenshots.

## Reference matrix

| Reference | Technique | Why it works | Adaptation here | Cost / risk |
| --- | --- | --- | --- | --- |
| [Codrops — Dondre Green case study](https://tympanus.net/codrops/2025/01/07/case-study-dondre-green/) | Pinned title, horizontal gallery, selective image focus, project-to-project continuity | Keeps one idea dominant while the scene changes around it | Use a single visual system per project and let sections settle before the next reveal | Medium / motion can overwhelm small screens |
| [Codrops — ZERO](https://tympanus.net/codrops/2026/07/17/zero-the-engineering-behind-a-defiant-interactive-narrative/) | One continuous scroll and interaction as narrative entry | Makes technique serve a story rather than decorate a page | Use scroll reveals only at architecture/state changes | High / requires strict animation hierarchy |
| [Codrops — The Spark](https://tympanus.net/codrops/2026/01/09/the-spark-engineering-an-immersive-story-first-web-experience/) | Story-first arc, restrained projection/geometry | A memorable visual sequence can stay readable | Give each project an enter → understand → explore → conclude rhythm | Medium / generated visuals must stay honest |
| [Codrops — Stefan Vitasović](https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/) | Editorial offsets, typography and geometry as transitions, lighter mobile mode | Creates personality without relying on cards | Use offset titles, open sections, and simplified mobile diagrams | Low–medium / layout needs careful wrapping |
| [Framer — Project Reveal](https://www.framer.com/marketplace/components/project-reveal/) | Large featured visual with scroll-driven reveal | Gives the selected project a clear first impression | Make PharmaStock’s generated system visual the hero object | Low / CSS transforms and SVG only |
| [Framer — Case Study Scroll](https://www.framer.com/marketplace/components/case-study-scroll/) | Cards tilt and settle with depth, with reduced-motion consideration | Adds physicality without requiring WebGL | Use small spring-like entrance offsets for stage visuals | Low / avoid applying it to every element |
| [Framer — Showcase Scroll](https://www.framer.com/marketplace/components/showcase-scroll/) | Selected project becomes the center of attention before transition | Creates hierarchy in a project index | Make PharmaStock large, systems work medium, coursework quiet | Low / CSS hover fallback is sufficient |
| [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/%40media/prefers-reduced-motion) | Motion preference as a first-class media query | Preserves the story for users who opt out | Disable stage translation/pulse; retain opacity and structure | Low / required |
| [web.dev — prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion) | Progressive motion reduction strategy | Gives a practical accessibility baseline | Keep diagrams static but fully labeled on reduced motion | Low / required |

## Technology decision

The existing 2.5D renderer is retained. The project storytelling problem is hierarchy and metaphor, not a lack of polygonal geometry. SVG, CSS, the existing intersection hook, and the current flow data provide the required depth at lower cost and with better mobile behavior. A Three.js migration would add weight without materially improving these diagrams.

## Acceptance checks

- `/projects` reads as a visual index, not a grid of equal cards.
- PharmaStock opens with a clearly labeled generated system visualization and an honest demo-data/backend boundary.
- Command Argument Passing is visibly about `fork → execvp → waitpid`, not another generic architecture stack.
- Hospital is visually about bed states and its Express/MySQL path.
- 390px and 768px retain hierarchy without depending on hover.
- No global route, renderer, analytics, search, SEO, or content-truth system is changed.

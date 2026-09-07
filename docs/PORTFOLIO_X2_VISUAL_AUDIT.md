# Portfolio X² — visual audit

Date: 2026-09-07

## Before state

The current home route is a strong first cinematic pass, not the old dashboard. It already has a fixed atmosphere, a chapter rail, oversized editorial type, an interactive SVG engineering graph, real project/coding/GitHub data, and shared navigation/search/analytics infrastructure. A local before-state screenshot was captured at:

- `tmp/before/home-1440-wait.png` (1440 × 900)

The screenshot is useful because it makes the remaining limitation obvious: the experience is visually authored, but its “world” is still mostly a DOM composition of large text, panels, and an SVG topology. It reads as a polished portfolio system before it reads as a continuous spatial instrument.

## Current vs target

| Area | Current | Target for X² |
| --- | --- | --- |
| Hero | Editorial title + CSS/SVG engineering core | One persistent camera/world layer with depth, orbital machinery, pointer lighting, and chapter-aware transformation |
| Scroll | Scene sections update a fixed field and local CSS effects | Scroll controls a single world state: camera, particle grammar, palette, rings, signal paths, image depth, and scene labels |
| Projects | Flagship copy + abstract architecture panels | Image-first editorial compositions with a large system visualization and distinct motion treatment per project |
| Coding | Good honest metric and rating curve, still chart-adjacent | 2,531 as a signal event: flowing platform streams and a physical rating trajectory |
| Systems | Interactive relationship list | Spatial map with animated links and a clear semantic fallback |
| GitHub | Honest live repository surface | Constellation treatment around the existing live data, without fabricating stars/forks |
| Navigation | Refined floating nav and command palette | Keep behavior, simplify chrome, connect nav state to chapters and the master world |
| Color | Mostly near-black with violet/cyan accents | Chapter palettes: electric/violet → emerald/lime → coral/orange → warm editorial → magenta/blue → amber/pink |
| Depth | Background grid, glow, SVG geometry, DOM layers | Canvas depth projection, foreground/midground/background planes, controlled blur, and chapter-specific light |
| Mobile | Responsive single-column CSS | Intentional mobile composition: one focused core, reduced particles, vertical case-study movement, no desktop cursor |

## Retain

- Next.js 16 App Router structure and the local version-matched guidance in `node_modules/next/dist/docs/`.
- Real data modules in `data/`, live GitHub/Codolio integrations, analytics, admin routes, API routes, sitemap, robots, structured data, contact links, and project detail routes.
- The existing command palette behavior, skip link, semantic headings, focus styles, reduced-motion CSS, and factual content constraints.
- Existing project-flow/case-study data as the source for system visualizations.

## Delete or replace visually

- The fixed grid/topology field as the dominant background metaphor.
- The hero's large DOM/SVG “graph card” treatment.
- Repeated route-page blocks that visually resemble metric panels.
- UI density that makes every annotation look like telemetry. Technical labels remain, but become editorial coordinates attached to scenes.

No factual project or repository data is deleted by this pass. The retired emergency-project terms were searched and none were found in source data.

## Rebuild plan

1. Add a progressively-enhanced `MasterWorldCanvas`: a single low-count canvas projected in 2.5D, with orbiting core modules, depth particles, data ribbons, repository nodes, pointer light, and scroll velocity.
2. Replace the home composition with connected chapters that remain readable without canvas. The canvas is a visual layer, never the content source.
3. Add image-transition primitives as CSS/DOM wrappers so the project story works with real assets when they exist and does not invent screenshots when they do not.
4. Add a small `/visual-lab` route containing independently labeled experiments for the master world, scroll camera, signal field, image movement, typography, magnetic interaction, architecture, and palette transitions.
5. Preserve the existing route/data shell and tune route pages toward the same editorial chapter language.

## Animation architecture

- One `requestAnimationFrame` loop owns the canvas world; no per-particle React state.
- Scroll progress and scroll velocity are sampled once and eased into world state.
- Pointer coordinates feed camera yaw, pitch, and a virtual light; touch devices skip pointer-only effects.
- DOM chapters use `IntersectionObserver`-style visibility and CSS transforms rather than a global animation loop.
- Reduced motion collapses the canvas to a quiet still field and turns large transforms into opacity/short reveals.
- The system is intentionally dependency-light. GSAP/ScrollTrigger is not added until a pinned image scene proves it needs more than the native scroll model.

## 3D / world architecture

The “3D” layer is a purposeful, GPU-friendly 2.5D projection rather than a generic spinning primitive:

- `CORE`: nested computational nucleus, orbital rings, and discipline nodes.
- `SIGNAL`: platform streams and rating particles.
- `WORK`: architecture blocks, project image planes, and moving request paths.
- `MAP`: relationship lines and technology satellites.
- `CONSTELLATION`: repository nodes sized only by the real repository list, with live language color.
- `CONTACT`: all paths ease toward a single warm point.

Each object has a semantic role and a DOM fallback label.

## Performance risks and mitigations

- Risk: an always-on canvas. Mitigation: cap DPR at 1.5, keep particle count under 220 desktop / 70 mobile, pause when tab hidden, and use a static fallback for reduced motion.
- Risk: too many large transforms. Mitigation: animate only scene wrappers and image planes; content remains in normal flow.
- Risk: image weight. Mitigation: no invented screenshots, native lazy loading for future assets, and CSS gradients/geometry for absent imagery.
- Risk: font/network variance. Mitigation: system fallbacks already exist in the app token chain.

## Mobile strategy

Mobile keeps the core, signal, color chapters, project sequence, and interactions that make sense for touch. It removes the chapter rail, cursor, dense constellations, and simultaneous decorative layers. Project scenes become vertical image/architecture stacks; the canvas runs fewer points at a capped pixel ratio.

## Accessibility strategy

- Canvas is `aria-hidden`; all meaningful labels, links, project facts, and actions are semantic DOM.
- Hover discoveries have focus/click equivalents.
- The visual lab is labeled as experimental and has plain-language descriptions.
- `prefers-reduced-motion` removes camera drift, particle motion, strong parallax, and cursor effects.
- Existing command palette focus/escape behavior and the global skip link remain in place.

## External technique matrix

| Effect | Reference | Technique learned | Adaptation |
| --- | --- | --- | --- |
| Scroll camera | [GSAP ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Scrub/pin/velocity are useful, but native progress is enough for the global camera | One eased scroll state drives the persistent canvas; no scroll hijacking |
| Depth gallery | [Codrops: scroll-reactive 3D gallery](https://tympanus.net/codrops/2026/03/09/building-a-scroll-reactive-3d-gallery-with-three-js-velocity-and-mood-based-backgrounds/) | Put visual planes on different depth layers and shift palette with scroll | CSS image planes use depth/clip/scale; absent assets use technical visualizations |
| WebGL scroll concepts | [Codrops: scroll-based Three.js](https://tympanus.net/codrops/2022/01/05/crafting-scroll-based-animations-in-three-js/) | A WebGL layer can follow scroll while the document remains semantic | Implement the same separation with a custom canvas to keep bundle/perf bounded |
| Visibility | [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) | Visibility work should be scoped to what the user can see | Scene wrappers only activate their local image/label transforms when intersecting |
| Motion accessibility | [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion) and [web.dev motion](https://web.dev/learn/accessibility/motion) | Replace non-essential movement with fades and stable layouts | Canvas becomes still, content stays fully available |

## Known pre-existing runtime issues found during audit

- The dev log showed a hydration warning in `Reveal` caused by client-only transition-delay attributes.
- The dev log showed an `FXScene` null-mark error during early layout measurement. The X² home removes that dependency from the main visual path; the old component remains available to non-home routes until it is safely retired.

## Stop condition for this pass

The first viewport must no longer be mistaken for a conventional dark developer portfolio: the core should read as an instrument in space, color should transition by chapter, and scroll should visibly change the world rather than only reveal adjacent sections. Build/lint are necessary but screenshots and runtime inspection are the acceptance gate.

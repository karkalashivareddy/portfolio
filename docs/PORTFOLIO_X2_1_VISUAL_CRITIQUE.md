# Portfolio X².1 — visual critique and refinement record

Date: 2026-09-07

## Browser verdict

The rebuilt home is no longer a dashboard. At 1440px it reads as a dark editorial
world: the fixed canvas supplies an engineering core, the headline is the primary
navigation cue, and the systems chapter changes the temperature to paper/cobalt.
The strongest moments are the arrival core, the coral PharmaStock architecture
scene, and the paper systems map.

The remaining weakness is continuity, not a lack of effects. The first viewport on
small screens is too quiet because the canvas has less contrast at mobile scale; the
home chapter rail was also pointing at chapters that the new composition no longer
rendered. `/systems`, `/journey`, and `/learning` were not real routes, which made
the requested chapter set feel unfinished. The refinement therefore adds route and
chapter continuity, a compact mobile core fallback, and a more explicit trajectory
and learning chapter without replacing the existing art direction.

## Current vs target

| Question | Current X² evidence | X².1 target | Decision |
| --- | --- | --- | --- |
| Dashboard risk | Low on desktop home; higher on coding/GitHub route surfaces | One visual language, fewer utility-like surfaces | Keep the open editorial routes; promote the shared world into missing chapters |
| 3D quality | Convincing 2.5D depth from projection, rings, particles, pointer yaw and scroll states | Meaningful spatial metaphor without dependency weight | Keep custom canvas; improve mobile fallback and chapter continuity |
| Scroll | World palette and scene grammar evolve with page progress | A coherent camera journey, not isolated reveals | Preserve one fixed canvas and map added chapters into the same progress field |
| Projects | PharmaStock is the strongest composition; no real screenshots exist | Generated visualizations clearly labeled, case-study-first | Keep generated architecture; do not invent images or metrics |
| About | Human, high-contrast editorial treatment | More room for trajectory and learning | Keep paper chapter; add dedicated trajectory/learning surfaces |
| Mobile | Typography works, but the engineering object is too easy to miss | A small, legible core survives without hover | Add a CSS mobile core fallback and reduce overflow risk |

## External technique matrix

| Reference | Technique | Why it works | Portfolio adaptation | Cost / risk |
| --- | --- | --- | --- | --- |
| [Codrops: scroll-revealed WebGL gallery](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/) | Scroll progress reveals a visual field while the DOM remains the readable layer | The visual event and semantic content stay synchronized | The fixed canvas remains decorative; HTML owns content and links | Medium; keep the existing 2D renderer to avoid WebGL startup cost |
| [Codrops: scroll-reactive 3D gallery](https://tympanus.net/codrops/2026/03/09/building-a-scroll-reactive-3d-gallery-with-three-js-velocity-and-mood-based-backgrounds/) | Velocity and mood-based background changes | Speed becomes physical feedback and chapter identity | Existing `scrollVelocity` drives particle energy; palettes shift by world progress | Low in current canvas; avoid distortion that harms text |
| [Awwwards: infinite-scroll WebGL example](https://www.awwwards.com/inspiration/infinite-scroll-homepage) | Long-form 3D/WebGL as a single navigable experience | A continuous environment makes sections feel related | Keep one MasterWorldCanvas rather than independent scene mounts | High if migrated to Three.js; current 2.5D is adequate |
| [One Page Love: Giulio](https://onepagelove.com/giulio) | Sparse, immersive 3D composition and a controlled preloader | Restraint gives the hero object authority | Keep the hero quiet around the core; avoid adding decorative panels | Medium; do not add audio or a blocking preloader |
| [One Page Love: Elliott Mangham](https://onepagelove.com/elliott-mangham) | Small interactions and scroll walkthroughs around a portfolio index | Discovery comes from details rather than constant motion | Use node hover/focus and the trajectory as deliberate discovery points | Low; keep hover optional and keyboard-safe |
| [Framer project-reveal component](https://www.framer.com/marketplace/components/project-reveal/) | Pinned, scroll-driven project reveal with dominant media | Projects become a sequence, not an archive grid | PharmaStock gets a staged architecture/trajectory story; no fake screenshots | Medium; generated diagrams are cheaper and truthful here |
| [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Scrub, pin, velocity, matchMedia and cleanup | Gives precise choreography without hijacking native scrolling | Use the same physical model in canvas; no new GSAP dependency is needed yet | Low conceptually; dependency would be unnecessary for current scope |
| [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) | Visibility-aware work | Expensive visuals need not run offscreen | Canvas already pauses when the document is hidden; future scene work should gate on visibility | Low; add only when another live scene is introduced |
| [web.dev motion accessibility](https://web.dev/learn/accessibility/motion) and [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion) | Motion preference as a first-class state | The content still works when movement is unsafe or unwanted | Existing reduced-motion CSS and canvas branch keep content readable | Low; must remain in every future experiment |

## 2.5D vs real 3D decision

The current renderer projects x/y/z points into a perspective plane, varies scale
with depth, rotates the world from pointer input, changes scene grammar as the page
scrolls, and caps pixel ratio/particle count by device. In the browser it produces
convincing depth at desktop size without a generic cube, a WebGL context, texture
loading, or a large dependency.

Real Three.js would improve material, lighting, and mesh occlusion, but the current
content is primarily lines, nodes, signals, and typography. It would not improve
the factual project diagrams enough to justify the migration in this polish phase.
The decision is therefore **keep 2.5D** and invest in composition, mobile clarity,
and meaningful scene transitions. A Three.js prototype remains appropriate for a
future asset-led case study once real project imagery exists.

## Browser evidence inspected

Desktop and mobile captures were taken under `tmp/after/` for the home, visual lab,
coding, projects, PharmaStock, about, GitHub and contact views, plus the requested
desktop widths. `tmp/before/home-1440-wait.png` is the comparison capture.

The current route inspection also exposed the missing `/systems`, `/journey`, and
`/learning` pages. X².1 closes that continuity gap while keeping `/admin`, live
GitHub/Codolio data, search, SEO, analytics, and contact behavior intact.

## Remaining weaknesses after this pass

- No real project screenshots are present in `public`, so project visuals remain
  generated diagrams and are labeled accordingly.
- The separate route pages still use a lighter “field notes” treatment than the
  home film; they are intentionally readable rather than pretending to be a full
  WebGL case study.
- A real mesh/material scene could be a future upgrade for a project with actual
  visual assets, but it is not a clear win for the current data-led world.

# Design System

Selected direction: **Premium Editorial Engineer + Interactive Engineering World**
(70% product / 20% interaction / 10% experimental). Supersedes the B × C note in
design-concepts.md — see `docs/ui-ux-review.md` for the full audit and rationale.
Dark theme only (no light theme — documented assumption).

---

## 1. Design tokens (implemented in `app/globals.css`)

### Color — dark "deep ink"
| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#0a0b0e` | page background |
| `--color-ink-1` | `#0d0f13` | alt/nested background |
| `--color-surface` | `#101216` | raised surface / cards |
| `--color-raised` | `#161a21` | nested surfaces |
| `--color-overlay` | `#1b2029` | popovers / menus |
| `--color-line` | `rgba(255,255,255,0.08)` | hairline borders |
| `--color-line-strong` | `rgba(255,255,255,0.16)` | grid / emphasis |
| `--color-fg-0` | `#f2f4f7` | primary text |
| `--color-fg-1` | `#a9b0bb` | secondary text |
| `--color-fg-2` | `#6b7280` | muted text / meta |
| `--color-accent` | `#5b8def` | primary interactive accent |
| `--color-accent-soft` | `#9db6f0` | lighter accent (text on washed fills) |

Accent family (data + status, used sparingly): `accent-blue #5b8def`,
`accent-cyan #22d3ee`, `accent-indigo #818cf8`, `accent-violet #a78bfa`,
`accent-magenta #e879f9`, `accent-green #34d399`, `accent-amber #f5b759`.

Status: `ok #34d399` (LIVE/RECENT), `warn #f5b759` (STALE), `danger #f87171` (ERROR).
No rainbow gradients; one primary accent; radial washes at low opacity only.

### Typography
- **Display**: `Space Grotesk` (`--font-space`), geometric + tight tracking — headings, name.
- **UI/body**: `Inter` (`--font-inter`).
- **Mono**: `JetBrains Mono` (`--font-jetbrains`) — labels, meta, code, numbers.
- Clamp-based scale (Tailwind v4 `--text-*` utilities):

| Utility | Size | Line-height |
|---|---|---|
| `text-display` | `clamp(2.75rem, 7.5vw, 5rem)` | 1.03 |
| `text-h1` | `clamp(1.9rem, 4.5vw, 3.25rem)` | 1.08 |
| `text-h2` | `clamp(1.4rem, 3.2vw, 2.25rem)` | 1.15 |
| `text-h3` | `clamp(1.1rem, 2vw, 1.5rem)` | 1.25 |

### Spacing / grid
- Base 4 px; scale 4/8/12/16/24/32/48/64/96/128.
- Container `max-w-[1280px]` (980 px on content pages), px `clamp(1.25rem, 4vw, 2rem)`.
- Section vertical rhythm `clamp(4rem, 10vw, 8rem)`.

### Radii / shadows
- `--r-sm 8px`, `--r-md 12px`, `--r-lg 20px`. Cards `--r-lg`, buttons `--r-md`.
- `--shadow-1` subtle, `--shadow-2` elevated; glow washes via radial-gradient only.

### Motion tokens
- `--ease-out: cubic-bezier(0.16,1,0.3,1)`; `--ease-in-out`.
- Durations: `--t-micro 150ms`, `--t-std 250ms`, `--t-slow 400ms`, `--t-reveal 600ms`.
- `prefers-reduced-motion: reduce` → all transform/opacity animation disabled.

### Breakpoints
`sm 480 · md 768 · lg 1024 · xl 1280 · 2xl 1440 · 1920 cap`.

---

## 2. Component rules

| Component | Rule |
|---|---|
| Page | ink bg; hairline grid substrate behind hero only |
| Nav | sticky glass, hairline bottom border; monogram `SR`; About + scroll-spy on home |
| Section | numbered label (`01 — …`) in mono + `text-h2` heading + hairline divider |
| Card | `surface` bg, `--r-lg`, hairline; hover `line-strong` (+2 px lift on interactive) |
| Button (primary) | accent fill, ink text, `--r-md`, arrow icon, magnetic on desktop |
| Button (ghost) | hairline border, `fg-0`, accent border on hover |
| Chip / tag | mono 0.72rem, `accent`-soft fill, accent text |
| Stat block | display-type number, mono label, optional `source` caption |
| Code accent | mono block, hairline frame, green/blue tokenization (no rainbow) |
| Command palette | centered modal, overlay bg, `role=option` list, ⌘K; restores focus on close |
| Engineering graph | **2D SVG/DOM**, no WebGL; interactive nodes = real domains/projects; reduced-motion = static |

---

## 3. Interaction spec
- **Page transition**: `app/template.tsx` — 250 ms fade + 10 px translate + blur(4px); instant on reduced motion.
- **Reveal on scroll**: opacity + translateY(24→0), 600 ms ease-out, once; stagger ≤ 80 ms.
- **Cursor** (desktop `pointer: fine`, no touch, no reduced-motion): 6 px dot + 34 px ring, lerp follow; contextual labels via `data-cursor` (VIEW CASE STUDY / OPEN GITHUB / COPY EMAIL).
- **Magnetic buttons**: ≤ 6 px pull toward cursor, spring-back 300 ms (desktop only).
- **Hero graph**: hover/keyboard-focus expands node → shows mapped projects; edges draw-in 800 ms; center node pulses (`node-pulse`).
- **Count-up numbers**: 900 ms ease-out on first view.
- **Command palette**: arrows + Esc + focus trap; focus returns to opener.
- **Scroll-spy**: IntersectionObserver sets active nav section on home.

---

## 4. Accessibility in the system
- Contrast: `fg-1` on `ink` ≥ 7:1; accent-on-ink ≥ 4.5:1 for text.
- All motion gated by `prefers-reduced-motion`.
- Focus ring: 2 px accent, 2 px offset; palette traps and restores focus.
- Landmarks (`header/nav/main/section/footer`); one `h1` per page.
- Graph is real DOM text (accessible), node connectivity mirrored in a list; no keyboard-only content, no color-alone status.
- Copy-email button announces via `aria-live="polite"`.
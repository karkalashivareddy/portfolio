"use client";

import { useEffect, useRef } from "react";

/** ENGINEERING FIELD — the fixed background environment.
 *
 *  A single scroll-driven "camera" moves through cinematic atmosphere states:
 *  the light (hue, intensity, position) crossfades continuously between home
 *  chapters as you scroll, so the background never bands and never jumps.
 *  Each chapter owns a colour family — electric → cyan → coral → violet →
 *  amber → sky → magenta → lime → warm — and the field lerps between them so
 *  the whole page reads as one continuous visual world rather than stacked
 *  sections.
 *
 *  Everything is either a one-time crossfading rAF on a few fixed layers or
 *  pure CSS animation; nothing animates width/height/top/left. Under
 *  prefers-reduced-motion the environment renders its resting state with no
 *  movement. Purely decorative (aria-hidden) and layered behind content. */
// Nine chapter colour families (RGB), one per section. Authority stays in
// the data; the components use these same families via --chapter-* tokens.
const families: Record<string, number[][]> = {
  origin: [[91, 141, 239], [34, 211, 238]],       // electric + cyan
  signal: [[34, 211, 238], [56, 189, 248]],       // cyan + sky
  work: [[255, 122, 107], [245, 183, 89]],        // coral + amber
  capabilities: [[167, 139, 250], [232, 121, 249]], // violet + magenta
  coding: [[245, 183, 89], [163, 230, 53]],       // amber + lime
  github: [[56, 189, 248], [91, 141, 239]],       // sky + electric
  journey: [[232, 121, 249], [167, 139, 250]],    // magenta + violet
  learning: [[163, 230, 53], [52, 211, 153]],     // lime + emerald
  contact: [[91, 141, 239], [232, 121, 249]],     // electric → magenta convergence
};

export default function FXScene() {
  const lightsRef = useRef<HTMLDivElement[]>([]);
  const lightRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const topoRef = useRef<HTMLDivElement>(null);
  const motifsRef = useRef<SVGSVGElement[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let raf = 0;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cur = { x: pos.x, y: pos.y };

    // Chapter breakpoints (home): measured from real sections so the atmosphere
    // always tracks actual content, not hard-coded offsets.
    const chapters = [
      { id: "origin" },
      { id: "signal" },
      { id: "work" },
      { id: "capabilities" },
      { id: "coding" },
      { id: "github" },
      { id: "journey" },
      { id: "learning" },
      { id: "contact" },
    ];
    const readable = () =>
      chapters.reduce(
        (acc, c) => {
          const el = document.getElementById(c.id);
          if (el) acc.push({ top: el.offsetTop, id: c.id });
          return acc;
        },
        [] as { top: number; id: string }[]
      );
    let marks = readable();

    // Current blend weights for the two active family colours. We lerp the RGB
    // channel values between chapter families and write them onto the two
    // colour planes, so hue/temperature moves continuously with scroll.
    const current = { r: [91, 141, 239], g: [34, 211, 238] };
    const target = { r: current.r.slice(), g: current.g.slice() };

    const pickBlend = (y: number) => {
      if (marks.length === 0) return { a: families.origin[0], b: families.origin[1] };
      const mid = y + window.innerHeight * 0.42;
      let mark = marks[0];
      for (const m of marks) if (m.top <= mid) mark = m;
      const fam = families[mark.id] ?? families.origin;
      const next = marks[marks.indexOf(mark) + 1];
      if (!next) return { a: fam[0], b: fam[1] };
      const span = next.top - mark.top;
      const p = span > 0 ? Math.max(0, Math.min(1, (mid - mark.top) / span)) : 0;
      const nf = families[next.id] ?? families.origin;
      const lerp = (x: number[], y: number[]) => x.map((v, i) => v + (y[i] - v) * p);
      return { a: lerp(fam[0], nf[0]), b: lerp(fam[1], nf[1]) };
    };

    const sceneMode = (id: string) => {
      if (id === "origin") return 0;
      if (["signal", "coding", "github"].includes(id)) return 1;
      if (["work", "capabilities"].includes(id)) return 2;
      return 3;
    };

    let targetY = 0;
    let vel = 0;
    const settle = 0.07;

    const update = () => {
      const sc = window.scrollY;
      vel = Math.abs(sc - targetY);
      targetY = sc;

      // Lerp family colours toward scroll-derived targets (smooth-crossfade).
      const fam = pickBlend(sc);
      const mid = sc + window.innerHeight * 0.42;
      const route = window.location.pathname;
      let activeId = marks.length === 0
        ? route.includes("about")
          ? "about"
          : route.includes("coding") || route.includes("github")
            ? "coding"
            : route.includes("project")
              ? "work"
              : route.includes("contact")
                ? "contact"
                : "origin"
        : "origin";
      for (const mark of marks) if (mark.top <= mid) activeId = mark.id;
      const activeMode = sceneMode(activeId);
      motifsRef.current.forEach((motif, index) => {
        motif.style.opacity = index === activeMode ? "1" : "0";
      });
      const r = fam.a, g = fam.b;
      for (let i = 0; i < 3; i++) {
        target.r[i] = target.r[i] * 0.85 + r[i] * 0.15;
        target.g[i] = target.g[i] * 0.85 + g[i] * 0.15;
        current.r[i] += (target.r[i] - current.r[i]) * settle;
        current.g[i] += (target.g[i] - current.g[i]) * settle;
      }
      const c0 = `rgba(${current.r[0]},${current.r[1]},${current.r[2]},0.11)`;
      const c1 = `rgba(${current.g[0]},${current.g[1]},${current.g[2]},0.08)`;
      if (lightsRef.current[0]) {
        lightsRef.current[0].style.background =
          `radial-gradient(46% 42% at 72% 10%, ${c0}, transparent 70%)`;
      }
      if (lightsRef.current[1]) {
        lightsRef.current[1].style.background =
          `radial-gradient(42% 38% at 82% 24%, ${c1}, transparent 72%)`;
      }

      // Camera drift: parallax depth planes translate with scroll.
      const ds = sc * 0.16;
      const dn = sc * 0.22;
      const dt = sc * 0.1;
      if (gridRef.current) gridRef.current.style.transform = `translate3d(0, ${ds}px, 0)`;
      if (dotsRef.current) dotsRef.current.style.transform = `translate3d(0, ${dn}px, 0)`;
      if (topoRef.current)
        topoRef.current.style.transform = `translate3d(0, ${dt}px, 0) scale(${
          1 + Math.min(0.12, vel * 0.0004)
        })`;

      // Cursor spotlight (fine pointer only).
      if (lightRef.current && window.matchMedia("(pointer: fine)").matches) {
        cur.x += (pos.x - cur.x) * 0.08;
        cur.y += (pos.y - cur.y) * 0.08;
        lightRef.current.style.transform = `translate3d(${cur.x - 320}px, ${cur.y - 320}px, 0)`;
        lightRef.current.style.background =
          `radial-gradient(closest-side, ${c0.replace("0.11", "0.07")}, transparent 66%)`;
      }

      raf = requestAnimationFrame(update);
    };

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
    };
    const onResize = () => {
      marks = readable();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    raf = requestAnimationFrame(update);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const setLights = (el: HTMLDivElement | null, i: number) => {
    if (el) lightsRef.current[i] = el;
  };

  const setMotif = (el: SVGSVGElement | null, i: number) => {
    if (el) motifsRef.current[i] = el;
  };

  return (
    <div className="fx-scene" aria-hidden>
      {/* L1 atmosphere — two colour planes crossfaded by the camera plus a few
          static context tints; the two planes dominate the hue shift */}
      <div ref={(el) => setLights(el, 0)} className="fx-layer fx-layer-c0" />
      <div ref={(el) => setLights(el, 1)} className="fx-layer fx-layer-c1" />
      <div className="fx-layer fx-light fx-light-violet" />
      <div className="fx-layer fx-light fx-light-coral" />
      <div className="fx-layer fx-light fx-light-emerald" />
      <div className="fx-layer fx-light fx-light-void" />

      {/* L2 depth field + L3 grid — drift with the camera */}
      <div ref={gridRef} className="fx-layer fx-grid will-change-transform" />
      <div ref={dotsRef} className="fx-layer fx-dots will-change-transform" />

      {/* L4 topology — sparse constellation + single traveling signal */}
      <div ref={topoRef} className="fx-layer fx-topology will-change-transform">
        <div className="fx-motifs">
        <svg ref={(el) => setMotif(el, 0)} className="fx-topology-svg fx-motif" viewBox="0 0 120 100" preserveAspectRatio="none">
          <g className="fx-topo-edges" fill="none" strokeWidth="0.35">
            <path d="M8 30 L34 14 L60 26 L84 12 L112 24" />
            <path d="M14 62 L38 48 L64 60 L92 46 L110 58" />
            <path d="M34 14 L38 48 M60 26 L64 60 M84 12 L92 46 M112 24 L110 58" />
            <path d="M8 30 L14 62 M28 84 L38 48" />
          </g>
          <g className="fx-topo-nodes" fill="rgba(122,162,255,0.5)">
            <circle cx="8" cy="30" r="0.7" />
            <circle cx="34" cy="14" r="0.55" />
            <circle cx="60" cy="26" r="0.7" />
            <circle cx="84" cy="12" r="0.55" />
            <circle cx="112" cy="24" r="0.7" />
            <circle cx="14" cy="62" r="0.55" />
            <circle cx="38" cy="48" r="0.8" />
            <circle cx="64" cy="60" r="0.7" />
            <circle cx="92" cy="46" r="0.55" />
            <circle cx="110" cy="58" r="0.7" />
            <circle cx="28" cy="84" r="0.55" />
          </g>
          <path
            className="fx-topo-signal"
            d="M8 30 L34 14 L60 26 L84 12 L112 24 L110 58 L92 46 L64 60 L38 48 L14 62 L8 30"
            fill="none"
          />
        </svg>
        <svg ref={(el) => setMotif(el, 1)} className="fx-topology-svg fx-motif" viewBox="0 0 120 100" preserveAspectRatio="none">
          <g className="fx-motif-line" fill="none">
            <path d="M4 68 H20 V54 H36 V60 H52 V35 H68 V44 H84 V22 H116" />
            <path d="M4 78 H30 V70 H46 V76 H64 V56 H80 V64 H98 V48 H116" />
          </g>
          <g className="fx-motif-node">
            <circle cx="20" cy="54" r="1" /><circle cx="52" cy="35" r="1" />
            <circle cx="84" cy="22" r="1" /><circle cx="98" cy="48" r="1" />
          </g>
          <g className="fx-motif-label">
            <text x="8" y="64">INPUT</text><text x="48" y="30">TRACE</text><text x="88" y="18">OUTPUT</text>
          </g>
        </svg>
        <svg ref={(el) => setMotif(el, 2)} className="fx-topology-svg fx-motif" viewBox="0 0 120 100" preserveAspectRatio="none">
          <g className="fx-motif-arch" fill="none">
            <path d="M18 22 H102 M18 22 V78 H102 M42 22 V78 M78 22 V78" />
            <path d="M8 50 H18 M42 50 H78 M102 50 H112" />
            <path d="M10 44 L18 50 L10 56 M110 44 L102 50 L110 56" />
          </g>
          <g className="fx-motif-node"><circle cx="18" cy="22" r="1.1" /><circle cx="42" cy="50" r="1" /><circle cx="78" cy="50" r="1" /><circle cx="102" cy="78" r="1.1" /></g>
          <g className="fx-motif-label"><text x="22" y="18">REQUEST</text><text x="46" y="46">SERVICE</text><text x="82" y="74">DATA</text></g>
        </svg>
        <svg ref={(el) => setMotif(el, 3)} className="fx-topology-svg fx-motif" viewBox="0 0 120 100" preserveAspectRatio="none">
          <path className="fx-motif-trajectory-path" d="M8 78 C28 72 24 38 44 46 S58 84 76 66 S86 24 112 18" />
          <g className="fx-motif-node"><circle cx="8" cy="78" r="1.1" /><circle cx="44" cy="46" r="1.1" /><circle cx="76" cy="66" r="1.1" /><circle cx="112" cy="18" r="1.1" /></g>
          <g className="fx-motif-label"><text x="6" y="88">START</text><text x="39" y="39">BUILD</text><text x="104" y="13">NEXT</text></g>
        </svg>
        </div>
      </div>

      {/* L5 film grain + L6 cursor light */}
      <div className="fx-layer fx-noise" />
      <div ref={lightRef} className="fx-cursor-light" />
    </div>
  );
}

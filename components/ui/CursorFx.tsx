"use client";

import { useEffect, useRef, useState } from "react";

/** Desktop-only cursor layer: dot + trailing ring + `[data-cursor]` labels and
 *  `[data-magnetic]` pull. Disabled on touch and under reduced-motion.
 *  The native cursor stays visible — the layer augments, never replaces it. */
export default function CursorFx() {
  const [ok, setOk] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;
    const r = requestAnimationFrame(() => setOk(true));
    return () => cancelAnimationFrame(r);
  }, []);

  useEffect(() => {
    if (!ok) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: target.x, y: target.y };
    let raf = 0;
    let labelText = "";
    let lastMag: HTMLElement | null = null;
    let lastCursorState = "default";

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      dot.style.opacity = "1";
      dot.style.transform = `translate3d(${target.x - 3}px, ${target.y - 3}px, 0)`;

      const targetEl = e.target as HTMLElement | null;
      const cursorEl = targetEl?.closest?.("[data-cursor], a, button, [role=button]") as HTMLElement | null;
      const text = cursorEl?.getAttribute("data-cursor") ?? "";
      const state = cursorEl?.getAttribute("data-cursor-kind") ?? (cursorEl?.matches("a,button,[role=button]") ? "link" : "default");
      if (state !== lastCursorState) {
        ring.dataset.state = state;
        lastCursorState = state;
      }
      if (text && !labelText) {
        label.style.opacity = "1";
      }
      if (text) {
        labelText = text;
        label.textContent = text;
        label.style.transform = `translate3d(${target.x + 18}px, ${target.y + 16}px, 0)`;
        ring.classList.add("is-hover");
        dot.classList.add("is-accent");
      } else {
        labelText = "";
        label.style.opacity = "0";
        ring.classList.remove("is-hover");
        dot.classList.remove("is-accent");
      }

      const mag = targetEl?.closest?.("[data-magnetic]") as HTMLElement | null;
      if (lastMag && lastMag !== mag) {
        lastMag.style.transition = "transform 320ms cubic-bezier(0.16, 1, 0.3, 1)";
        lastMag.style.transform = "";
        delete lastMag.dataset.magnetized;
      }
      if (mag) {
        if (!mag.dataset.magnetized) {
          mag.style.transition = "transform 240ms cubic-bezier(0.16, 1, 0.3, 1)";
          mag.dataset.magnetized = "1";
        }
        const r = mag.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        mag.style.transform = `translate(${dx * 0.12}px, ${dy * 0.12}px)`;
      }
      lastMag = mag;
    };

    const loop = () => {
      ringPos.x += (target.x - ringPos.x) * 0.16;
      ringPos.y += (target.y - ringPos.y) * 0.16;
      ring.style.transform = `translate3d(${ringPos.x - 13}px, ${ringPos.y - 13}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const onDown = () => dot.classList.add("is-down");
    const onUp = () => dot.classList.remove("is-down");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
    };
  }, [ok]);

  if (!ok) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] hidden lg:block" aria-hidden="true">
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} />
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 1 }} />
      <span ref={labelRef} className="cursor-label" style={{ opacity: 0 }} />
    </div>
  );
}

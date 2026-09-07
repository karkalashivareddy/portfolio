"use client";

import { useEffect, useRef, useState } from "react";

/** Scroll-driven vertical rail fill for the home timeline. Purely decorative:
 *  the fill's height tracks how far the section has been scrolled through.
 *  Reduced-motion safe — collapses to a static (no motion) state. */
export default function TimelineRail() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      const visible = Math.min(1, Math.max(0, (viewport - rect.top) / rect.height));
      setProgress(reduce ? 1 : visible);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute, { passive: true });
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div ref={ref} className="absolute left-[11px] sm:left-[15px] top-1 bottom-1 w-px" aria-hidden>
      <div className="absolute inset-0 bg-line" />
      <div
        className="absolute inset-x-0 top-0 w-px origin-top transition-transform duration-150 ease-out"
        style={{
          height: "100%",
          background: "linear-gradient(180deg, #e879f9, rgba(34,211,238,0.55))",
          transform: `scaleY(${progress})`,
        }}
      />
    </div>
  );
}
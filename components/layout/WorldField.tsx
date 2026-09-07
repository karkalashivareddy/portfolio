"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** A quiet, route-aware light field. It is intentionally not a topology or grid;
 * the content scenes provide the engineering diagrams. */
export default function WorldField() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      el.style.setProperty("--world-progress", progress.toFixed(3));
      el.style.setProperty("--world-drift", `${window.scrollY * -0.035}px`);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  const route = pathname === "/" ? "origin" : pathname.replace(/^\//, "").split("/")[0] || "origin";

  return (
    <div ref={ref} className={`world-field world-route-${route} ${pathname === "/" ? "world-field-home" : ""}`} aria-hidden="true">
      <div className="world-field-light world-field-light-a" />
      <div className="world-field-light world-field-light-b" />
      <div className="world-field-light world-field-light-c" />
      <div className="world-field-horizon" />
      <div className="world-field-grain" />
    </div>
  );
}

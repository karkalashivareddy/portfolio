"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const CHAPTERS = [
  { id: "origin", index: "01", label: "ORIGIN" },
  { id: "signal", index: "02", label: "SIGNAL" },
  { id: "work", index: "03", label: "WORK" },
  { id: "systems", index: "04", label: "SYSTEMS" },
  { id: "coding", index: "05", label: "CODING" },
  { id: "github", index: "06", label: "GITHUB" },
  { id: "journey", index: "07", label: "JOURNEY" },
  { id: "learning", index: "08", label: "LEARNING" },
  { id: "contact", index: "09", label: "CONTACT" },
];

/** Right-rail readout: scroll progress + current home chapter. Decorative,
 *  desktop only, hidden under reduced-motion. The rail fill is pure CSS
 *  (scroll-timeline); only the chapter label needs the scroll-spy. */
export default function ChapterRail() {
  const pathname = usePathname();
  const labelRef = useRef<HTMLSpanElement>(null);
  const [chapter, setChapter] = useState("01 · SIGNAL");

  useEffect(() => {
    if (pathname !== "/") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let raf = 0;
    const update = () => {
      const y = window.scrollY + window.innerHeight * 0.5;
      let current = CHAPTERS[0];
      for (const c of CHAPTERS) {
        const el = document.getElementById(c.id);
        if (el && el.offsetTop <= y) current = c;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24) {
        current = CHAPTERS[CHAPTERS.length - 1];
      }
      setChapter(`${current.index} · ${current.label}`);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  if (pathname !== "/") return null;

  return (
    <div className="rail-progress hidden xl:flex" aria-hidden>
      <span ref={labelRef} className="rail-label">{chapter}</span>
      <div className="rail-track">
        <div className="rail-fill" />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

type Props = {
  children: React.ReactNode;
  index: number;
  className?: string;
};

/** Staged hero entrance — each element clips-in from below with a slight
 *  displacement and settle. Runs once on mount; reduced-motion collapses the
 *  transition to ~instant via the global media query. */
export default function HeroReveal({ children, index, className = "" }: Props) {
  // Keep the first paint complete even if hydration is delayed. The CSS
  // transition remains available for future state changes, but the hero never
  // presents a blank composition to a slow device or screenshot reader.
  const [inView] = useState(true);

  return (
    <div
      className={`hero-line ${inView ? "is-in" : ""} ${className}`}
      style={{ ["--hero-d" as string]: `${index * 120}ms` }}
    >
      {children}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

/** Root route transition — remounts on navigation (template.js), so the
 *  enter animation runs per route change. Reduced-motion is instant via CSS. */
export default function Template({ children }: { children: React.ReactNode }) {
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    const r = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntering(false));
    });
    return () => cancelAnimationFrame(r);
  }, []);

  return <div className={entering ? "pagefx in" : "pagefx"}>{children}</div>;
}
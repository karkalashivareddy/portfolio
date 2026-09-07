"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
};

/** Scroll-reveal wrapper.
 *
 *  Under CSS scroll-timeline support the reveal is pure CSS (scrubs with
 *  scroll, off-main-thread) and the JS does nothing. Otherwise — and under
 *  prefers-reduced-motion, which collapses the CSS animation — an
 *  IntersectionObserver applies the visible state so content is never hidden. */
export default function Reveal({ children, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const supports = useSyncExternalStore(
    () => () => undefined,
    () => typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()"),
    () => false
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || supports) return;
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setVisible(true));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [supports]);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay && !supports ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

"use client";

import { useInView } from "../../hooks/useInView";

export default function CaseStudyStage({
  children,
  className = "",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.18 });

  return (
    <section ref={ref} className={`case-study-stage ${inView ? "is-visible" : ""} ${className}`}>
      {label ? <p className="case-study-stage-label">{label}</p> : null}
      {children}
    </section>
  );
}

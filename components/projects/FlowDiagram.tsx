"use client";

import { useInView } from "../../hooks/useInView";

/** Animated architecture flow for a project — a discrete set of stage chips
 *  connected by a circuit trace. Decorative in purpose (adds motion to the
 *  gallery); never claims anything beyond the labels fed in. Reduced-motion
 *  safe: the pulse is CSS-driven and collapses to a static trace. */
export default function FlowDiagram({ stages }: { stages: string[] }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });
  const count = stages.length;

  return (
    <div
      ref={ref}
      className={`flow-diagram ${inView ? "is-running" : ""}`}
      role="img"
      aria-label={`Architecture flow: ${stages.join(", ")}`}
    >
      <div className="flow-track" aria-hidden>
        <span className="flow-pulse" />
      </div>
      <div className="flex items-center justify-between gap-1">
        {stages.map((s, i) => (
          <div
            key={`${s}-${i}`}
            className="flow-chip"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <span className="flow-chip-dot" aria-hidden />
            <span className="flow-chip-label">{s}</span>
          </div>
        ))}
      </div>
      <span className="flow-mini" aria-hidden>
        {count} stages
      </span>
    </div>
  );
}
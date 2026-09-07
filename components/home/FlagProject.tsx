"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useInView } from "../../hooks/useInView";
import type { Project } from "../../lib/types";
import { CLASS_META } from "../../data/projects";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  "publishing-soon": { label: "Publishing soon", color: "#f5b759" },
  published: { label: "Published", color: "#34d399" },
  academic: { label: "Academic", color: "#7aa2ff" },
  local: { label: "Local", color: "#f5b759" },
};

/** PharmaStock architecture — React SPA → service layer → Express/MongoDB backend.
 *  Nodes cascade in on view, signal traces flow through the pipeline. */
function PharmaStockArch() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35 });
  const on = inView ? "is-visible" : "";
  return (
    <div ref={ref} className={`system-map ${on}`} role="img" aria-label="PharmaStock architecture: React SPA with 17 pages connects through a service layer to an Express and MongoDB backend with JWT authentication.">
      <svg viewBox="0 0 880 330" className="w-full h-auto" aria-hidden>
        <path className="amv-trace d1" d="M120 160 H300 V160 H500 M500 160 H720" fill="none" />
        <path className="amv-trace d2" d="M500 178 V240 H720" fill="none" />
        <path className="amv-flow f1" d="M120 160 H300 V160 H500 M500 160 H720" fill="none" />
        <path className="amv-flow f2" d="M500 178 V240 H720" fill="none" />
        <path className="amv-trace d3" d="M720 240 m0 -60 a60 60 0 1 1 -0.001 0 Z" fill="none" />
        <path className="amv-flow f3" d="M720 240 m0 -60 a60 60 0 1 1 -0.001 0 Z" fill="none" />

        <g className="amv-node n1">
          <circle cx="120" cy="160" r="7" />
          <text x="120" y="138" textAnchor="middle" className="amv-label">REACT SPA</text>
          <text x="120" y="152" textAnchor="middle" className="amv-sub">17 pages · RBAC</text>
        </g>
        <g className="amv-node n2">
          <circle cx="300" cy="160" r="7" />
          <text x="300" y="138" textAnchor="middle" className="amv-label">SERVICE LAYER</text>
          <text x="300" y="152" textAnchor="middle" className="amv-sub">async adapters</text>
        </g>
        <g className="amv-node n3">
          <circle cx="500" cy="160" r="7" />
          <circle className="amv-pulse-core" cx="500" cy="160" r="7" />
          <text x="500" y="138" textAnchor="middle" className="amv-label">EXPRESS API</text>
          <text x="500" y="152" textAnchor="middle" className="amv-sub">JWT + bcrypt</text>
        </g>
        <g className="amv-node n4">
          <circle cx="720" cy="160" r="7" />
          <text x="760" y="138" textAnchor="middle" className="amv-label">ANALYTICS</text>
          <text x="760" y="152" textAnchor="middle" className="amv-sub">Recharts · KPIs</text>
        </g>
        <g className="amv-node n5">
          <circle cx="720" cy="240" r="7" />
          <text x="720" y="276" textAnchor="middle" className="amv-label">MONGODB</text>
          <text x="720" y="290" textAnchor="middle" className="amv-sub">Mongoose ODM</text>
        </g>
        <g className="amv-node n6">
          <text x="500" y="220" textAnchor="middle" className="amv-tag">REST CONTRACT</text>
          <text x="500" y="234" textAnchor="middle" className="amv-sub">swappable backend</text>
        </g>
        <g className="amv-node n7">
          <circle className="amv-src" cx="120" cy="160" r="3" />
          <circle className="amv-src" cx="500" cy="192" r="3" />
        </g>
      </svg>
      <div className="system-map-legend">
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-0.5 rounded bg-[rgba(91,141,239,0.7)]" aria-hidden /> data flow
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-0.5 rounded bg-white/25" aria-hidden /> API contract
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full border border-dashed border-white/30" aria-hidden /> analytics layer
        </span>
      </div>
    </div>
  );
}

/** Editorial flagship composition: identifier + thesis + honest system map. */
export default function FlagProject({ project }: { project: Project }) {
  const status = STATUS_LABEL[project.status] ?? { label: project.status, color: "#a9b0bb" };
  const cls = CLASS_META[project.class];
  const accent = project.accent ?? "#7aa2ff";

  return (
    <section id="work-featured" className="relative">
      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-12 items-center">
        <div>
          <div className="flex items-center gap-3 text-[12px] font-mono uppercase tracking-[0.14em] text-fg-2">
            <span className="text-fg-0">{cls.label}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" aria-hidden />
            <span style={{ color: status.color }}>{status.label}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" aria-hidden />
            <span>{project.rank}</span>
          </div>

          <h3 className="mt-5 font-display text-h2 md:text-h1 tracking-tight text-balance text-fg-0">
            {project.title}
          </h3>
          <p className="mt-4 max-w-[420px] text-[15px] text-fg-1 leading-relaxed">
            {project.tagline}
          </p>

          <dl className="mt-6 flex flex-col gap-1.5 text-[13px] font-mono">
            <div className="flex gap-2">
              <dt className="text-fg-2 w-24 shrink-0">stack</dt>
              <dd className="text-fg-0">{project.stack.slice(0, 5).join(" · ")}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-fg-2 w-24 shrink-0">pages</dt>
              <dd className="text-fg-0">17-page React portal</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-fg-2 w-24 shrink-0">backend</dt>
              <dd className="text-fg-0">Express + MongoDB target</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-fg-1 bg-white/[0.04] border border-line"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-7 flex items-center gap-5">
            <Link
              href={`/projects/${project.slug}`}
              data-magnetic="true"
              data-cursor="OPEN CASE STUDY"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-line text-fg-0 text-[14px] hover:text-white hover:border-line-strong hover:-translate-y-0.5 transition-all duration-300"
            >
              Case study
              <ArrowUpRight
                className="w-4 h-4 text-fg-2 group-hover:text-fg-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                aria-hidden
              />
            </Link>
            <span className="text-[11px] font-mono text-fg-2 max-w-[220px]">
              {project.statusNote}
            </span>
          </div>
        </div>

        <PharmaStockArch />
      </div>
      <div
        className="mt-10 lg:mt-0 h-px w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}66, transparent)` }}
        aria-hidden
      />
    </section>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../../lib/types";
import { CLASS_META } from "../../data/projects";
import { projectFlows } from "../../data/projectFlows";
import { GithubIcon } from "../ui/BrandIcons";
import FlowDiagram from "./FlowDiagram";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  "publishing-soon": { label: "Publishing soon", color: "#f5b759" },
  published: { label: "Published", color: "#34d399" },
  academic: { label: "Academic", color: "#7aa2ff" },
  local: { label: "Local", color: "#f5b759" },
};

export default function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const status = STATUS_LABEL[project.status] ?? { label: project.status, color: "#a9b0bb" };
  const cls = CLASS_META[project.class];
  const accent = project.accent ?? "#7aa2ff";
  const flow = projectFlows[project.slug];

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-cursor="OPEN CASE STUDY"
      className={`group project-scene relative flex flex-col gap-4 hover:bg-white/[0.02] transition-all ${
        large ? "md:col-span-2" : ""
      }`}
    >
      <span
        className="absolute inset-x-0 top-0 h-px opacity-50 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3">
        <span
          className="inline-flex items-center gap-1.5 text-[10.5px] font-mono tracking-wide uppercase"
          style={{ color: cls.color, background: `${cls.color}14`, border: `1px solid ${cls.color}30` }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: cls.color }} />
          {cls.label}
        </span>
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-mono"
          style={{
            color: status.color,
            background: `${status.color}14`,
            border: `1px solid ${status.color}30`,
          }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: status.color }} />
          {status.label}
        </span>
      </div>

      <div>
        <h3 className="font-display text-2xl text-fg-0 tracking-tight transition-colors">
          {project.title}
        </h3>
        <p className="mt-2 text-[13.5px] text-fg-1 leading-relaxed">{project.tagline}</p>
      </div>

      {flow && <FlowDiagram stages={flow} />}

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {project.tags.slice(0, 4).map((t) => (
          <span
            key={t}
            className="text-[11px] font-mono text-fg-1"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-line">
        <span className="text-[12px] text-fg-2 font-mono">{project.type}</span>
        <span className="inline-flex items-center gap-2 text-[13px] text-fg-0">
          {project.github ? <GithubIcon className="w-4 h-4 text-fg-2" aria-hidden /> : null}
          Case study
          <ArrowUpRight
            className="w-4 h-4 text-fg-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg-0"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}

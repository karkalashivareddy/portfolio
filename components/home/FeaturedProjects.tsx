import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { featuredProjects, secondaryProjects } from "../../data/projects";
import ProjectCard from "../projects/ProjectCard";
import SectionHeader from "../ui/SectionHeader";
import Reveal from "../ui/Reveal";
import FlagProject from "./FlagProject";

export default function FeaturedProjects() {
  return (
    <section id="work" className="chapter-scene chapter-work py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <SectionHeader
            index="03"
            label="WORK"
            title="Selected work"
            description="Flagship builds ranked by engineering quality — each with the real architecture, the decisions behind it, and its current status."
          />
        </Reveal>

        <Reveal className="block">
          <FlagProject project={featuredProjects[0]} />
        </Reveal>

        {featuredProjects.length > 1 && (
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {featuredProjects.slice(1).map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        )}

        {secondaryProjects.length > 0 && (
          <div className="mt-5">
            <Reveal>
              <div className="flex flex-col gap-3">
                {secondaryProjects.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="group project-row"
                  >
                    <div>
                      <div className="project-index">{p.rank} / {p.type}</div>
                      <div className="font-display text-lg text-fg-0 group-hover:text-white transition-colors">
                        {p.title}
                      </div>
                      <div className="mt-1 text-[13px] text-fg-1 max-w-[560px]">{p.tagline}</div>
                      <div className="project-flow mt-3">{p.stack.slice(0, 5).join("  →  ")}</div>
                    </div>
                    <span className="inline-flex items-center gap-2 text-[13px] text-fg-1 shrink-0">
                      <span className="font-mono text-[11px] text-fg-2">{p.type}</span>
                      <ArrowUpRight className="w-4 h-4 text-fg-2 group-hover:text-fg-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </span>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        )}

        <Reveal>
          <div className="mt-10">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-[14px] text-electric hover:text-white transition-colors"
            >
              All projects &amp; case studies
              <ArrowUpRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

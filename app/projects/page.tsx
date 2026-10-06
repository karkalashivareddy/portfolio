import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects, additionalProjects, CLASS_META } from "../../data/projects";
import CaseStudyVisual from "../../components/projects/CaseStudyVisual";

export const metadata: Metadata = {
  title: "Projects",
  description: "Engineering projects and case studies by Shiva Reddy.",
  alternates: { canonical: "/projects" },
};

function ProjectLine({ project, index, featured = false }: { project: (typeof projects)[number]; index: number; featured?: boolean }) {
  return (
    <Link href={`/projects/${project.slug}`} className={`case-index-line ${featured ? "is-featured" : ""}`} style={{ "--project-accent": project.accent ?? "#8ea8ff" } as React.CSSProperties}>
      <div className="case-index-line-copy"><span className="case-index-number">{String(index).padStart(2, "0")}</span><div><p className="case-study-eyebrow">{project.class} / {project.type}</p><h3>{project.title.replace(" — ", "\n")}</h3><p>{project.tagline}</p><small>{project.stack.slice(0, 4).join(" · ")}</small></div></div>
      <div className="case-index-line-action"><span>OPEN SYSTEM</span><ArrowUpRight size={19} aria-hidden /></div>
    </Link>
  );
}

/**
 * Split a project title into a lead and an accented half.
 *
 * The featured block used to hard-code "PharmaStock" while rendering
 * `projects[0]`, so the index advertised one system as the flagship and opened
 * another — the exact kind of contradiction the rest of the site avoids. Both
 * halves now come from the featured project's own title.
 */
function splitTitle(title: string): { lead: string; accent: string } {
  const words = title.replace(/^\S+\s+[\u2014\u2013-]\s+/, "").split(" ").filter(Boolean);
  const cut = Math.ceil(words.length / 2);
  return { lead: words.slice(0, cut).join(" "), accent: words.slice(cut).join(" ") };
}

export default function ProjectsPage() {
  const featured = projects[0];
  const strong = projects.slice(1, 3);
  const supporting = projects.slice(3);
  const heading = splitTitle(featured.title);
  const featuredLabel = CLASS_META[featured.class]?.label ?? "FLAGSHIP";
  return (
    <div className="case-index-page">
      <div className="case-index-shell">
        <header className="case-index-intro">
          <p className="case-study-eyebrow">03 / WORK / SYSTEMS MADE VISIBLE</p>
          <h1><span>Projects are</span><span>where</span><em>the world gets specific.</em></h1>
          <p>{projects.length} case studies, arranged by depth rather than volume: the flagship system first, then the strong systems, then supporting coursework. Every entry links to its source where a public repository exists.</p>
        </header>

        <section className="case-index-feature" style={{ "--project-accent": featured.accent ?? "#f5b759" } as React.CSSProperties}>
          <div className="case-index-feature-copy"><p className="case-study-eyebrow">01 / {featuredLabel} SYSTEM</p><h2>{heading.lead}<span>{heading.accent}</span></h2><p>{featured.summary}</p><div className="case-index-facts">{featured.tags.slice(0, 3).map((tag) => <span key={tag}>{tag.toUpperCase()}</span>)}</div><Link href={`/projects/${featured.slug}`} className="case-index-open" aria-label={`Open the ${featured.title} case study`}>Enter the case study <ArrowUpRight size={17} aria-hidden /></Link></div>
          <div className="case-index-feature-visual"><CaseStudyVisual project={featured} /></div>
        </section>

        <section className="case-index-chapter"><div className="case-index-chapter-head"><p className="case-study-eyebrow">02 / STRONG SYSTEM PROJECTS</p><p>Different engineering questions, different visual grammar.</p></div>{strong.map((project, index) => <ProjectLine key={project.slug} project={project} index={index + 2} />)}</section>
        <section className="case-index-chapter case-index-supporting"><div className="case-index-chapter-head"><p className="case-study-eyebrow">03 / SUPPORTING ENGINEERING WORK</p><p>Honest scope. Useful breadth.</p></div>{supporting.map((project, index) => <ProjectLine key={project.slug} project={project} index={index + 4} />)}</section>

        <section className="case-index-signals"><p className="case-study-eyebrow">04 / ADDITIONAL PUBLIC WORK</p>{additionalProjects.map((item) => <a key={item.name} href={item.url ?? undefined} target={item.url ? "_blank" : undefined} rel={item.url ? "noreferrer" : undefined}><span>{item.name}</span><small>{item.scope} · {item.note}</small></a>)}</section>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects, additionalProjects } from "../../data/projects";
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

export default function ProjectsPage() {
  const featured = projects[0];
  const strong = projects.slice(1, 3);
  const supporting = projects.slice(3);
  return (
    <main className="case-index-page">
      <div className="case-index-shell">
        <header className="case-index-intro">
          <p className="case-study-eyebrow">03 / WORK / SYSTEMS MADE VISIBLE</p>
          <h1><span>Projects are</span><span>where</span><em>the world gets specific.</em></h1>
          <p>Five detailed case studies, arranged by depth rather than volume. Start with the flagship system, then move through processes, beds, algorithms and coursework. Additional published work is listed below.</p>
        </header>

        <section className="case-index-feature" style={{ "--project-accent": featured.accent ?? "#f5b759" } as React.CSSProperties}>
          <div className="case-index-feature-copy"><p className="case-study-eyebrow">01 / FLAGSHIP SYSTEM</p><h2>Pharma<span>Stock</span></h2><p>{featured.summary}</p><div className="case-index-facts"><span>17-PAGE REACT PORTAL</span><span>BATCH + EXPIRY</span><span>ANALYTICS</span></div><Link href={`/projects/${featured.slug}`} className="case-index-open">Enter the case study <ArrowUpRight size={17} aria-hidden /></Link></div>
          <div className="case-index-feature-visual"><CaseStudyVisual project={featured} /></div>
        </section>

        <section className="case-index-chapter"><div className="case-index-chapter-head"><p className="case-study-eyebrow">02 / STRONG SYSTEM PROJECTS</p><p>Different engineering questions, different visual grammar.</p></div>{strong.map((project, index) => <ProjectLine key={project.slug} project={project} index={index + 2} />)}</section>
        <section className="case-index-chapter case-index-supporting"><div className="case-index-chapter-head"><p className="case-study-eyebrow">03 / SUPPORTING ENGINEERING WORK</p><p>Honest scope. Useful breadth.</p></div>{supporting.map((project, index) => <ProjectLine key={project.slug} project={project} index={index + 4} />)}</section>

        <section className="case-index-signals"><p className="case-study-eyebrow">04 / ADDITIONAL PUBLIC WORK</p>{additionalProjects.map((item) => <a key={item.name} href={item.url ?? undefined} target={item.url ? "_blank" : undefined} rel={item.url ? "noreferrer" : undefined}><span>{item.name}</span><small>{item.scope} · {item.note}</small></a>)}</section>
      </div>
    </main>
  );
}

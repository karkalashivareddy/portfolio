import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import type { CaseStudy, Project } from "../../lib/types";
import { caseStudies } from "../../data/caseStudies";
import { projects, CLASS_META } from "../../data/projects";
import { projectFlows } from "../../data/projectFlows";
import { SITE_URL } from "../../lib/site";
import Button from "../ui/Button";
import { GithubIcon } from "../ui/BrandIcons";
import FlowDiagram from "./FlowDiagram";
import CaseStudyStage from "./CaseStudyStage";
import CaseStudyVisual from "./CaseStudyVisual";

const STATUS_LABEL: Record<string, string> = {
  "publishing-soon": "Publishing soon",
  published: "Published",
  academic: "Academic build",
  "local-demo": "Local demo",
};

const SECTION_COPY: Record<string, { problem: string; system: string; ending: string }> = {
  "pharmastock-medicine-stock-management": {
    problem: "Pharmacy staff need one place to see stock, expiring batches and low-stock items before a shortage becomes a surprise.",
    system: "The important boundary is deliberate: the shipped frontend runs on demo-data adapters today, while its async service contract is shaped for an Express + MongoDB backend later.",
    ending: "A product surface designed around a real domain model: batches, transactions, expiry, roles and derived analytics.",
  },
  "command-argument-passing-system": {
    problem: "The abstract frames a small but important operating-system question: how should a parent hand a command and its arguments to a child, then know how execution ended?",
    system: "This is a planned process lifecycle, not a UI stack. The visualization follows argv from a parent parser through fork, exec, and wait.",
    ending: "A clear process-lifecycle design is a useful starting point; runtime behavior remains future work until the implementation is published.",
  },
  "hospital-bed-management-system": {
    problem: "Hospitals need a live availability view instead of manually reconciling bed status across separate lists.",
    system: "A RESTful Express API over MySQL feeds two clients: a vanilla HTML/CSS/JS dashboard and a React interface with bed cards and filtering.",
    ending: "A focused CRUD system whose value is clarity: a status can be read, changed and retrieved through one consistent API.",
  },
};

function stageNumber(index: number) {
  return String(index).padStart(2, "0");
}

function StageHeading({ number, children }: { number: string; children: React.ReactNode }) {
  return <h2 className="case-study-heading"><span>{number}</span>{children}</h2>;
}

function ListBlock({ items, className = "" }: { items: string[]; className?: string }) {
  return <ul className={`case-study-list ${className}`}>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function StackStrip({ study, project }: { study?: CaseStudy; project: Project }) {
  const groups = study?.stack ?? [{ category: "Stack", items: project.stack }];
  return <div className="case-stack-strip">{groups.map((group) => <div key={group.category}><span>{group.category}</span><p>{group.items.join("  ·  ")}</p></div>)}</div>;
}

export default function ProjectDetail({ project }: { project: Project }) {
  const study = caseStudies[project.slug];
  const copy = SECTION_COPY[project.slug];
  const flow = projectFlows[project.slug];
  const titleBySlug = new Map(projects.map((item) => [item.slug, item.title]));
  const relatedSlugs = study?.related ?? [];
  const relatedProjects = relatedSlugs.map((slug) => projects.find((item) => item.slug === slug)).filter(Boolean) as Project[];
  const projectIndex = projects.findIndex((item) => item.slug === project.slug) + 1;
  const isFlagship = project.slug === "pharmastock-medicine-stock-management";
  const displayTitle = isFlagship
    ? "Pharma\nStock\nMedicine\nManagement"
    : project.slug === "command-argument-passing-system"
      ? "Command\nArgument\nPassing\nSystem"
      : project.slug === "hospital-bed-management-system"
        ? "Hospital Bed\nManagement\nSystem"
        : project.title.replace(" — ", "\n");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    codeRepository: project.github ?? undefined,
    programmingLanguage: project.stack[0],
    author: { "@type": "Person", name: "Karkala Shiva Reddy", url: SITE_URL },
    url: `${SITE_URL}/projects/${project.slug}`,
  };

  return (
    <article className={`case-study-page case-study-${project.slug}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="case-study-shell">
        <header className="case-study-hero">
          <div className="case-study-hero-copy">
            <Link href="/projects" className="case-study-back"><ArrowLeft size={15} aria-hidden /> All projects</Link>
            <p className="case-study-eyebrow">PROJECT {stageNumber(projectIndex)} / {CLASS_META[project.class]?.label ?? "BUILD"} / {project.type}</p>
            <h1>{displayTitle}</h1>
            <p className="case-study-tagline">{project.tagline}</p>
            <div className="case-study-meta"><span>{STATUS_LABEL[project.status] ?? project.status}</span><span>{project.tags.join(" · ")}</span></div>
            {project.statusNote ? <p className="case-study-truth"><i aria-hidden />{project.statusNote}</p> : null}
            <div className="case-study-actions">
              {project.github ? <Button href={project.github} external variant="ghost"><GithubIcon className="w-4 h-4" aria-hidden /> Repository</Button> : null}
              {project.demo ? <Button href={project.demo} external><ExternalLink className="w-4 h-4" aria-hidden /> Live demo</Button> : null}
            </div>
          </div>
          <div className="case-study-hero-visual"><CaseStudyVisual project={project} /></div>
        </header>

        <CaseStudyStage label="The reason this system exists" className="case-study-stage-problem">
          <div className="case-study-wide-copy"><StageHeading number="01">PROBLEM</StageHeading><p>{copy?.problem ?? project.problem}</p></div>
        </CaseStudyStage>

        <CaseStudyStage label="The system, made inspectable" className="case-study-stage-system">
          <div className="case-study-stage-heading"><StageHeading number="02">SYSTEM</StageHeading><p>{copy?.system ?? project.solution}</p></div>
          {flow ? <FlowDiagram stages={flow} /> : null}
          <StackStrip study={study} project={project} />
        </CaseStudyStage>

        {study ? <>
          <CaseStudyStage label={isFlagship ? "Entities and movement" : "The execution path"} className="case-study-stage-detail">
            <div className="case-study-detail-grid">
              <div><StageHeading number="03">{isFlagship ? "INVENTORY" : "LIFECYCLE"}</StageHeading><p>{study.overview[0]}</p></div>
              <div className="case-study-detail-aside"><span>WHAT IS VISIBLE</span><ListBlock items={study.features.slice(0, isFlagship ? 6 : 5)} /></div>
            </div>
          </CaseStudyStage>

          <CaseStudyStage label={isFlagship ? "Signals from the domain" : "Decisions that keep the process correct"} className="case-study-stage-decisions">
            <div className="case-study-detail-grid">
              <div><StageHeading number="04">{isFlagship ? "ANALYTICS" : "ENGINEERING DECISIONS"}</StageHeading><p>{study.overview[1] ?? project.solution}</p>{isFlagship ? <p className="case-study-note">No numerical results are invented here. The supported analytics are derived from stock, expiry and sales data in the project model.</p> : null}</div>
              <div className="case-study-detail-aside"><span>IMPLEMENTATION NOTES</span><ListBlock items={study.engineeringDecisions} /></div>
            </div>
          </CaseStudyStage>

          <CaseStudyStage label="The part worth carrying forward" className="case-study-stage-learned">
            <div className="case-study-learned"><StageHeading number="05">WHAT I LEARNED</StageHeading><ListBlock items={study.lessons} /><p className="case-study-settle">{copy?.ending ?? project.summary}</p></div>
          </CaseStudyStage>
        </> : <CaseStudyStage label="Scope, honestly framed" className="case-study-stage-detail">
          <div className="case-study-detail-grid"><div><StageHeading number="03">BUILD NOTES</StageHeading><p>{project.summary}</p><p className="case-study-note">This is a generated system visualization, not a product screenshot.</p></div><div className="case-study-detail-aside"><span>TECHNOLOGIES</span><ListBlock items={project.stack} /></div></div>
        </CaseStudyStage>}

        {relatedProjects.length > 0 ? <section className="case-study-next"><p className="case-study-eyebrow">NEXT SYSTEM</p>{relatedProjects.slice(0, 1).map((related) => <Link key={related.slug} href={`/projects/${related.slug}`}><span>{titleBySlug.get(related.slug) ?? related.title}</span><ArrowUpRight size={22} aria-hidden /></Link>)}</section> : <section className="case-study-next"><p className="case-study-eyebrow">RETURN TO THE INDEX</p><Link href="/projects"><span>Explore the other builds</span><ArrowUpRight size={22} aria-hidden /></Link></section>}
      </div>
    </article>
  );
}

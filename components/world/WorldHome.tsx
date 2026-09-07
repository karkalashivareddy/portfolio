"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import { codingAggregate } from "../../data/coding";
import { featuredProjects, projects } from "../../data/projects";
import { profile, socials, verifiedNumbers } from "../../data/profile";
import { engineeringGraph } from "../../data/engineeringGraph";
import { timeline } from "../../data/timeline";
import EmailCopyButton from "../ui/EmailCopyButton";
import MasterWorldCanvas from "./MasterWorldCanvas";

const chapters = [
  ["origin", "Arrival"], ["signal", "Signal"], ["work", "Work"], ["systems", "Map"],
  ["github", "Constellation"], ["about", "Engineer"], ["journey", "Trajectory"],
  ["learning", "Horizon"], ["contact", "Next move"],
] as const;

function ChapterMark({ number, title, note }: { number: string; title: string; note: string }) {
  return <div className="x2-chapter-mark"><span>{number}</span><strong>{title}</strong><small>{note}</small></div>;
}

function KineticWords() {
  return <h1 className="x2-hero-title"><span>COMPUTER</span><span className="x2-word-offset">SCIENCE</span><span className="x2-word-outline">ENGINEER<span className="x2-dot">.</span></span></h1>;
}

function SignalScene() {
  const values = [
    ["01", "CodeChef", "1,943", "#b8ee4a"], ["02", "LeetCode", "264", "#54e5ff"],
    ["03", "GFG", "225", "#32d583"], ["04", "HackerRank", "68", "#ffb347"], ["05", "Codeforces", "31", "#ee4da9"],
  ] as const;
  return <section id="signal" className="x2-section x2-signal">
    <div className="x2-wrap"><ChapterMark number="02" title="THE SIGNAL" note="practice becomes visible" />
      <div className="x2-signal-intro"><p className="x2-kicker">{codingAggregate.source} / verified aggregate / {codingAggregate.asOf}</p><div className="x2-signal-total">{verifiedNumbers.problemsSolved.toLocaleString("en-US")}</div><p className="x2-signal-caption">accepted solutions across {verifiedNumbers.platforms} platforms<span>not a badge — a habit</span></p></div>
      <div className="x2-stream-list">{values.map(([index, platform, total, color]) => <a key={platform} href={platform === "CodeChef" ? "https://www.codechef.com/users/shivareddy_27" : "/coding"} target={platform === "CodeChef" ? "_blank" : undefined} rel={platform === "CodeChef" ? "noreferrer" : undefined} className="x2-stream" style={{ "--stream-color": color } as React.CSSProperties}><span>{index}</span><strong>{platform}</strong><i /><b>{total}</b><ArrowUpRight size={15} /></a>)}</div>
      <div className="x2-signal-foot"><span>{codingAggregate.contests} rated contests</span><span>{codingAggregate.maxStreak}-day longest streak</span><Link href="/coding">Read the full record <ArrowUpRight size={14} /></Link></div>
    </div>
  </section>;
}

function Architecture({ className = "" }: { className?: string }) {
  const steps = ["REACT", "REST API", "EXPRESS", "MONGOOSE", "MONGODB", "ANALYTICS"];
  return <div className={`x2-architecture ${className}`} aria-label="PharmaStock generated architecture visualization">
    {steps.map((step, index) => <div key={step} className={`x2-arch-node x2-arch-${index + 1}`}><small>0{index + 1}</small><strong>{step}</strong>{index < steps.length - 1 && <i>→</i>}</div>)}
    <div className="x2-arch-pulse" />
  </div>;
}

function WorkScene() {
  const flagship = featuredProjects[0];
  return <section id="work" className="x2-section x2-work"><div className="x2-wrap"><ChapterMark number="03" title="THE WORK" note="systems with a reason to exist" />
    <div className="x2-work-heading"><div><p className="x2-kicker">FLAGSHIP / ACADEMIC BUILD / GENERATED VISUALIZATION</p><h2>PHARMA<span>STOCK</span></h2></div><p>{flagship.tagline}</p></div>
    <div className="x2-project-stage"><div className="x2-project-atmosphere" /><div className="x2-project-window"><span className="x2-window-label">INVENTORY / GENERATED VISUALIZATION</span><div className="x2-metric-row"><b>STOCK</b><span>batch-aware medicine inventory</span></div><div className="x2-bars"><i /><i /><i /><i /><i /><i /></div><div className="x2-window-footer"><span>LOW STOCK</span><span>EXPIRY</span><span>SUPPLIERS</span></div></div><Architecture /></div>
    <div className="x2-project-caption"><p>{flagship.summary}</p><Link href={`/projects/${flagship.slug}`} data-magnetic>Open the case study <ArrowUpRight size={16} /></Link></div>
    <div className="x2-project-list">{projects.slice(1).map((project, index) => <Link key={project.slug} href={`/projects/${project.slug}`} className="x2-project-row" data-cursor="EXPLORE"><span>0{index + 2}</span><strong>{project.title.replace(" — ", " / ")}</strong><small>{project.type} · {project.status}</small><ArrowUpRight size={18} /></Link>)}</div>
  </div></section>;
}

function SystemsScene() {
  const [active, setActive] = useState("me");
  const activeNode = engineeringGraph.nodes.find((node) => node.id === active) ?? engineeringGraph.nodes[0];
  return <section id="systems" className="x2-section x2-systems"><div className="x2-wrap"><ChapterMark number="04" title="ENGINEERING MAP" note="relationships, not a skill wall" />
    <div className="x2-systems-heading"><p className="x2-kicker">hover / focus a node</p><h2>Everything is<br /><em>connected in context.</em></h2><p>Java moves into DSA. C opens Linux processes. Backend work meets a real data model. The system is the point.</p></div>
    <div className="x2-map"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>{engineeringGraph.edges.map((edge) => { const source = engineeringGraph.nodes.find((n) => n.id === edge.source); const target = engineeringGraph.nodes.find((n) => n.id === edge.target); if (!source || !target) return null; return <line key={`${edge.source}-${edge.target}`} x1={source.x * 100} y1={source.y * 100} x2={target.x * 100} y2={target.y * 100} className={edge.source === active || edge.target === active ? "is-active" : ""} />; })}</svg>{engineeringGraph.nodes.map((node) => <button key={node.id} type="button" className={`x2-map-node x2-map-${node.id} ${active === node.id ? "is-active" : ""}`} style={{ "--node-color": node.color } as React.CSSProperties} onMouseEnter={() => setActive(node.id)} onFocus={() => setActive(node.id)} onClick={() => setActive(node.id)}><i /><strong>{node.label}</strong><small>{node.sub}</small></button>)}</div>
    <div className="x2-map-output"><span>ACTIVE SYSTEM / {activeNode.id}</span><strong>{activeNode.label}</strong><p>{activeNode.sub}</p>{activeNode.links.slice(0, 3).map((link) => <Link key={link.label} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noreferrer" : undefined}>{link.label}<ArrowUpRight size={13} /></Link>)}</div>
  </div></section>;
}

function GitHubScene() {
  const [active, setActive] = useState(0);
  const repositories = [
    ["DataBase-System-and-Distributed-Backend-Development", "React · JavaScript", projects[0].github],
    ["Command-Argument-Passing-System", "C · Linux", projects[1].github],
    ["hospital-bed-dashboard", "Node · MySQL", projects[2].github],
    ["DSA2-Projects", "Java", projects[3].github],
    ["FWD", "HTML · CSS", projects[4].github],
  ] as const;
  return <section id="github" className="x2-section x2-github"><div className="x2-wrap"><ChapterMark number="05" title="THE CONSTELLATION" note="public work, exactly as reported" />
    <div className="x2-github-heading"><div><p className="x2-kicker">github / inspectable by design</p><h2>Repositories<br /><em>become a map.</em></h2></div><p>Early public workspace. No fabricated stars, forks, followers, or commits. The constellation is a visual index for the real repositories behind the work.</p></div>
    <div className="x2-repo-constellation">{repositories.map(([name, language, url], index) => <a key={name} href={url} target="_blank" rel="noreferrer" className={`x2-repo-node repo-${index + 1} ${active === index ? "is-active" : ""}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)}><i /><strong>{name}</strong><small>{language}</small></a>)}<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden><path d="M10 28 L32 65 L52 24 L76 68 L92 32" /><path d="M32 65 L76 68 M52 24 L92 32" /></svg></div>
    <div className="x2-github-footer"><span>LIVE / repository names are factual</span><Link href="/github">Open the GitHub index <ArrowUpRight size={14} /></Link></div>
  </div></section>;
}

function JourneyScene() {
  return <section id="journey" className="x2-section x2-journey"><div className="x2-wrap"><ChapterMark number="07" title="THE TRAJECTORY" note="time makes the system legible" />
    <div className="x2-journey-heading"><p className="x2-kicker">a moving record / {timeline.length} verified entries</p><h2>Keep moving<br /><em>toward harder systems.</em></h2><p>Projects, coursework and practice are arranged as a trajectory instead of a résumé stack. The line is the story: each build changes what the next one can ask.</p></div>
    <div className="x2-trajectory" aria-label="Engineering trajectory">
      <div className="x2-trajectory-line" />
      {timeline.slice(0, 6).map((entry, index) => <div key={entry.title} className={`x2-trajectory-node trajectory-${index + 1}`}><span>{entry.date}</span><i /><strong>{entry.title}</strong><small>{entry.kind} · {entry.source}</small></div>)}
    </div>
  </div></section>;
}

function LearningScene() {
  return <section id="learning" className="x2-section x2-learning"><div className="x2-wrap"><ChapterMark number="08" title="THE HORIZON" note="goals, not claims" />
    <div className="x2-learning-layout"><div><p className="x2-kicker">currently learning / deliberately unfinished</p><h2>Build the next<br /><em>useful layer.</em></h2></div><p>The roadmap stays visible because it is not a skills wall. These are the systems Shiva is actively working toward, one project at a time.</p></div>
    <div className="x2-learning-path">{profile.goals.map((goal, index) => <div key={goal} className="x2-learning-node"><span>0{index + 1}</span><strong>{goal}</strong><i /></div>)}</div>
    <Link href="/about" className="x2-learning-link">Read the field notes <ArrowUpRight size={15} /></Link>
  </div></section>;
}

function AboutScene() {
  return <section id="about" className="x2-section x2-about"><div className="x2-wrap"><ChapterMark number="06" title="THE ENGINEER" note="the human layer" /><div className="x2-about-words"><p>I BUILD<br /><em>SYSTEMS.</em></p><p>I SOLVE<br /><em>PROBLEMS.</em></p><p>I LEARN<br /><em>BY BUILDING.</em></p></div><div className="x2-about-story"><p className="x2-kicker">KARKALA SHIVA REDDY / {profile.degree}</p><p>{profile.shortBio}</p><div className="x2-about-facts"><span><b>Studying</b>{profile.university}</span><span><b>Working in</b>Java · C · DSA</span><span><b>Building toward</b>reliable systems</span></div><Link href="/about">Read the full field notes <ArrowUpRight size={15} /></Link></div><div className="x2-journey-line">{timeline.slice(0, 5).map((entry, index) => <div key={entry.title} className={index === 4 ? "is-current" : ""}><span>{entry.date}</span><strong>{entry.title}</strong></div>)}</div></div></section>;
}

function ContactScene() {
  return <section id="contact" className="x2-section x2-contact"><div className="x2-contact-orbit" /><div className="x2-wrap"><ChapterMark number="09" title="THE NEXT MOVE" note="chaos → silence" /><div className="x2-contact-copy"><p className="x2-kicker">open channel / {profile.location}</p><h2>LET&apos;S BUILD<br /><em>SOMETHING.</em></h2><p>{profile.headline}</p><EmailCopyButton className="x2-email" showMailto data-magnetic data-cursor="LET'S GO">{socials.email} <ArrowUpRight size={18} /></EmailCopyButton><div className="x2-contact-links"><a href={socials.github.url} target="_blank" rel="noreferrer">GitHub <ExternalLink size={13} /></a><a href={socials.linkedin.url} target="_blank" rel="noreferrer">LinkedIn <ExternalLink size={13} /></a><a href={socials.codolio.url} target="_blank" rel="noreferrer">Codolio <ExternalLink size={13} /></a></div></div></div></section>;
}

export default function WorldHome() {
  return <main className="x2-home is-loaded">
    <MasterWorldCanvas />
    <aside className="x2-chapter-rail" aria-label="World chapters">{chapters.map(([id, label], index) => <a key={id} href={`#${id}`}><span>0{index + 1}</span>{label}</a>)}</aside>
    <section id="origin" className="x2-hero"><div className="x2-wrap x2-hero-grid"><div className="x2-hero-copy"><p className="x2-kicker">01 / ARRIVAL / {profile.name.toUpperCase()}</p><KineticWords /><p className="x2-hero-lead">{profile.headline}</p><div className="x2-actions"><Link href="#work" className="x2-button x2-button-primary" data-magnetic data-cursor="ENTER WORLD">Enter the world <ArrowDownRight size={16} /></Link><Link href="/projects" className="x2-text-link" data-cursor="VIEW WORK">See the work <ArrowUpRight size={15} /></Link></div></div><div className="x2-hero-readout"><span>ENGINEERING UNIVERSE</span><b>CORE / ONLINE</b><small>Move, scroll, discover<br />a system in motion.</small></div><div className="x2-mobile-core" aria-hidden="true"><i /><b /><span>DSA</span><span>BACKEND</span><span>LINUX</span><span>DATA</span></div></div><a className="x2-scroll-cue" href="#signal"><span>scroll to travel</span><ArrowDownRight size={15} /></a></section>
    <SignalScene /><WorkScene /><SystemsScene /><GitHubScene /><AboutScene /><JourneyScene /><LearningScene /><ContactScene />
  </main>;
}

"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import SyncStatus from "../ui/SyncStatus";
import { friendlyDate } from "../../lib/format";

type Repo = { name: string; description: string | null; html_url: string; language: string | null; stars: number; forks: number; topics?: string[]; updated_at: string };
type Snapshot = { username: string; profile: { public_repos: number; followers: number; following: number; created_at: string; html_url: string }; counts: { stars: number; forks: number; languages: Record<string, number> }; repos: Repo[]; meta: { status: string; fetchedAt: string | null } };

const languageColors: Record<string, string> = { JavaScript: "#f5b759", TypeScript: "#7aa2ff", Java: "#ff896f", C: "#65dedb", Python: "#91d890", HTML: "#ed8fc8", CSS: "#a78bfa" };

function projectHref(name: string) {
  const value = name.toLowerCase();
  if (value.includes("database") || value.includes("pharma")) return "/projects/pharmastock-medicine-stock-management";
  if (value.includes("command-argument")) return "/projects/command-argument-passing-system";
  if (value.includes("hospital-bed")) return "/projects/hospital-bed-management-system";
  if (value === "fwd") return "/projects/fwd-coursework";
  if (value.includes("dsa2")) return "/projects/dsa2-java-projects";
  return null;
}

function isFeatured(name: string) {
  return Boolean(projectHref(name));
}

export default function GitHubArchive() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/github")
      .then((response) => response.ok ? response.json() as Promise<Snapshot> : Promise.reject(new Error("GitHub unavailable")))
      .then((next) => { if (active) { setSnapshot(next); setState("ok"); } })
      .catch(() => active && setState("error"));
    return () => { active = false; };
  }, []);

  const languageLinks = snapshot?.repos.reduce<Record<string, string[]>>((acc, repo) => { if (repo.language) (acc[repo.language] ??= []).push(repo.name); return acc; }, {}) ?? {};

  if (state === "loading") return <div className="github-archive-loading" aria-busy="true"><span /><p>forming the public archive…</p></div>;

  if (state === "error" || !snapshot) return <section className="github-archive-error"><p className="world-kicker"><span>06</span> / GITHUB / UNAVAILABLE</p><h1>The archive is<br /><i>temporarily quiet.</i></h1><p>GitHub data is unavailable right now. The public profile remains available when the sync returns.</p><a href="https://github.com/karkalashivareddy" target="_blank" rel="noopener noreferrer" data-cursor="OPEN PROFILE">Open GitHub profile <ArrowUpRight size={15} /></a></section>;

  const featured = snapshot.repos.filter((repo) => isFeatured(repo.name));
  const languages = Object.entries(snapshot.counts.languages).sort((a, b) => b[1] - a[1]);
  const recent = [...snapshot.repos].sort((a, b) => b.updated_at.localeCompare(a.updated_at)).slice(0, 5);
  const selectedRepo = snapshot.repos.find((repo) => repo.name === selected) ?? null;
  const nodes = snapshot.repos.map((repo, index) => ({ repo, left: `${12 + ((index * 29) % 77)}%`, top: `${22 + ((index * 43) % 58)}%` }));

  return (
    <div className="github-archive">
      <section className="github-archive-hero" aria-labelledby="github-archive-title"><div className="github-archive-hero-copy"><p className="world-kicker"><span>06</span> / GITHUB / ENGINEERING ARCHIVE</p><h1 id="github-archive-title">The work<br /><i>stays inspectable.</i></h1><p>Public repositories spanning systems coursework, full-stack builds, data structures and the tools around them.</p><div className="github-archive-actions"><a href={snapshot.profile.html_url} target="_blank" rel="noopener noreferrer" data-cursor="OPEN PROFILE">@{snapshot.username} <ExternalLink size={14} /></a><SyncStatus status={snapshot.meta.status} fetchedAt={snapshot.meta.fetchedAt} label="GitHub API" /></div></div><div className="github-archive-identity"><span className="github-archive-count">{snapshot.profile.public_repos}</span><span>PUBLIC<br />REPOSITORIES</span><div className="github-archive-stats"><span>{snapshot.counts.stars} stars</span><span>{snapshot.counts.forks} forks</span><span>since {friendlyDate(snapshot.profile.created_at)}</span></div></div></section>

      <section className="github-archive-chapter" aria-labelledby="constellation-title"><div className="github-archive-heading"><p className="world-kicker"><span>01</span> / CONSTELLATION / REAL REPOSITORIES</p><h2 id="constellation-title">A map of<br /><i>the work.</i></h2><p>Each node is a repository returned by GitHub. Size creates a visual hierarchy for featured portfolio work; labels and links remain the source of truth.</p></div><div className="github-constellation" aria-label="Interactive repository constellation">{nodes.map(({ repo, left, top }) => <a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer" className={`github-repo-node ${selected === repo.name ? "is-selected" : ""} ${isFeatured(repo.name) ? "is-featured" : ""}`} style={{ left, top, "--repo-color": languageColors[repo.language ?? ""] ?? "#65dedb" } as React.CSSProperties} onMouseEnter={() => setSelected(repo.name)} onFocus={() => setSelected(repo.name)} onMouseLeave={() => setSelected(null)} onBlur={() => setSelected(null)} data-cursor="OPEN REPOSITORY" aria-label={`${repo.name}, ${repo.language ?? "language unavailable"}, open repository`}><i aria-hidden /><span>{repo.name}</span><small>{repo.language ?? "untyped"} · {friendlyDate(repo.updated_at)}</small></a>)}</div>{selectedRepo ? <div className="github-repo-inspector" aria-live="polite"><span>INSPECTING / {selectedRepo.language ?? "REPOSITORY"}</span><strong>{selectedRepo.name}</strong><p>{selectedRepo.description ?? "No repository description published."}</p><a href={selectedRepo.html_url} target="_blank" rel="noopener noreferrer" data-cursor="OPEN SOURCE">Open source <ArrowUpRight size={14} /></a></div> : null}<div className="github-archive-accessible-list"><p className="world-kicker">KEYBOARD ACCESS / REPOSITORY INDEX</p>{snapshot.repos.map((repo) => <a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer"><span>{repo.name}</span><small>{repo.language ?? "language unavailable"} · {repo.stars} stars · updated {friendlyDate(repo.updated_at)}</small><ArrowUpRight size={14} aria-hidden /></a>)}</div></section>

      <section className="github-archive-chapter github-language-chapter" aria-labelledby="language-title"><div className="github-archive-heading"><p className="world-kicker"><span>02</span> / ENGINEERING STACK / ACTUAL LANGUAGES</p><h2 id="language-title">The tools<br /><i>leave traces.</i></h2><p>Language counts are calculated from the repositories in this snapshot. They describe the archive, not a claim of expertise.</p></div><div className="github-language-field">{languages.map(([language, count]) => <div key={language} className="github-language-row"><span className="github-language-dot" style={{ background: languageColors[language] ?? "#65dedb" }} /><b>{language}</b><i style={{ width: `${Math.max(8, (count / Math.max(...languages.map(([, value]) => value))) * 100)}%`, background: languageColors[language] ?? "#65dedb" }} /><small>{count} {count === 1 ? "repository" : "repositories"}</small></div>)}{languages.length === 0 ? <p className="github-muted">Language data unavailable for this snapshot.</p> : null}</div><div className="github-language-links">{Object.entries(languageLinks).map(([language, repos]) => <span key={language}><b>{language}</b>{repos.slice(0, 3).join(" · ")}</span>)}</div></section>

      <section className="github-archive-chapter github-timeline-chapter" aria-labelledby="timeline-title"><div className="github-archive-heading github-archive-heading-split"><div><p className="world-kicker"><span>03</span> / ACTIVITY / RECENT REPOSITORY SIGNAL</p><h2 id="timeline-title">An archive<br /><i>in motion.</i></h2></div><p>Recent activity is represented using the repository update dates returned by GitHub. No contribution heatmap is invented when detailed contribution data is unavailable.</p></div><div className="github-timeline">{recent.map((repo, index) => <a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="github-timeline-item"><span>0{index + 1}</span><div><strong>{repo.name}</strong><small>{friendlyDate(repo.updated_at)} · {repo.language ?? "language unavailable"}</small></div><ArrowUpRight size={15} aria-hidden /></a>)}</div></section>

      <section className="github-archive-chapter github-featured-chapter" aria-labelledby="featured-title"><div className="github-archive-heading"><p className="world-kicker"><span>04</span> / FEATURED WORK / PROJECT ↔ SOURCE</p><h2 id="featured-title">Follow the<br /><i>engineering trail.</i></h2><p>These are repository matches inferred from the portfolio’s project names. Open the case study for the visual story, then inspect the source when a public repository is present.</p></div><div className="github-featured-list">{featured.length ? featured.map((repo, index) => <div className="github-featured-line" key={repo.name}><span>0{index + 1}</span><div><strong>{repo.name}</strong><small>{repo.language ?? "language unavailable"} · {repo.description ?? "No description published."}</small></div><div className="github-featured-actions">{projectHref(repo.name) ? <a href={projectHref(repo.name)!}>CASE STUDY</a> : null}<a href={repo.html_url} target="_blank" rel="noopener noreferrer" data-cursor="OPEN SOURCE">SOURCE <ArrowUpRight size={14} /></a></div></div>) : <p className="github-muted">No featured project repository matches are available in the current GitHub snapshot.</p>}</div></section>

      <a className="github-archive-next" href="/contact" data-cursor="NEXT">Return to the next move <ArrowUpRight size={20} aria-hidden /></a>
    </div>
  );
}

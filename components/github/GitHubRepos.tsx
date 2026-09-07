"use client";

import { useEffect, useState } from "react";
import { Search, Star, GitFork, ExternalLink, Calendar, ShieldCheck } from "lucide-react";
import { GithubIcon } from "../ui/BrandIcons";
import SyncStatus from "../ui/SyncStatus";
import { friendlyDate } from "../../lib/format";

type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stars: number;
  forks: number;
  topics?: string[];
  updated_at: string;
};

type Snapshot = {
  username: string;
  profile: { public_repos: number; followers: number; following: number; created_at: string; html_url: string };
  counts: { stars: number; forks: number };
  repos: Repo[];
  meta: { status: string; fetchedAt: string | null };
};

const LANG_COLORS: Record<string, string> = {
  HTML: "#e34c26",
  CSS: "#563d7c",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Java: "#b07219",
  Python: "#3572A5",
  C: "#555555",
  "C++": "#f34b7d",
  Shell: "#89e051",
};

const CONSTELLATION: [number, number][] = [
  [28, 26], [64, 14], [96, 40], [132, 20], [168, 38], [204, 16],
  [248, 30], [288, 52], [324, 24], [356, 48], [392, 32], [428, 18],
  [118, 66], [160, 78], [214, 62], [268, 84], [320, 68], [378, 82], [438, 60],
];

const EDGES: [number, number][] = [
  [0, 1], [1, 3], [3, 5], [5, 7], [7, 9], [9, 11],
  [2, 4], [4, 8], [6, 10],
  [12, 13], [14, 15], [15, 17], [16, 18],
  [1, 12], [5, 14], [9, 17],
];

export default function GitHubRepos() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"updated" | "name" | "stars" | "forks">("updated");

  useEffect(() => {
    let active = true;
    fetch("/api/github")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad"))))
      .then((j) => {
        if (!active) return;
        setSnapshot(j);
        setState("ok");
      })
      .catch(() => active && setState("error"));
    return () => {
      active = false;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="flex items-center gap-2 text-[13px] text-fg-2 font-mono" aria-busy="true">
        <span className="inline-block w-3 h-3 rounded-full border border-accent animate-pulse" />
        syncing GitHub…
      </div>
    );
  }

  if (state === "error" || !snapshot) {
    return (
      <div className="card p-6 text-[13px] text-danger font-mono">
        GitHub is unavailable right now — try again shortly.
      </div>
    );
  }

  const languages = Array.from(
    new Set(snapshot.repos.map((r) => r.language).filter(Boolean) as string[])
  ).sort();

  const visible = snapshot.repos
    .filter((r) => {
      const q = query.trim().toLowerCase();
      const inText =
        !q ||
        r.name.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q) ||
        (r.topics ?? []).some((t) => t.toLowerCase().includes(q));
      const inLang = lang === "all" || r.language === lang;
      return inText && inLang;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "stars") return b.stars - a.stars;
      if (sortBy === "forks") return b.forks - a.forks;
      return a.updated_at < b.updated_at ? 1 : -1;
    });

  const filterInput =
    "text-[13px] text-fg-0 bg-ink-1/60 border border-line rounded-lg px-3 py-2 outline-none focus:border-accent/60 transition-colors placeholder:text-fg-2";

  return (
    <div className="flex flex-col gap-6">
      <div className="data-field relative overflow-hidden py-6 md:py-8">
        <svg
          className="absolute inset-0 w-full h-32 opacity-[0.35] pointer-events-none"
          viewBox="0 0 460 100"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <g stroke="rgba(122,162,255,0.28)" strokeWidth="1">
            {EDGES.map(([i, j]) => (
              <line
                key={`${i}-${j}`}
                x1={CONSTELLATION[i][0]}
                y1={CONSTELLATION[i][1]}
                x2={CONSTELLATION[j][0]}
                y2={CONSTELLATION[j][1]}
              />
            ))}
          </g>
          <g>
            {CONSTELLATION.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1.1} fill="#7aa2ff" />
            ))}
          </g>
        </svg>
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <a
            href={`https://github.com/${snapshot.username}`}
            target="_blank"
            rel="noopener noreferrer"
            data-outbound="github"
            data-cursor="OPEN PROFILE"
            className="flex items-center gap-3 group"
          >
              <span className="flex items-center justify-center w-11 h-11 border-b border-sky/60 text-fg-0 group-hover:border-white transition-colors">
              <GithubIcon className="w-5 h-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <h2 className="text-[15px] text-fg-0 font-display group-hover:text-white transition-colors truncate">
                @{snapshot.username}
              </h2>
              <span className="flex items-center gap-3 text-[12px] text-fg-2 font-mono">
                <span>{snapshot.profile.public_repos} repos</span>
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3 h-3" aria-hidden /> {snapshot.counts.stars}
                </span>
                <span className="inline-flex items-center gap-1">
                  <GitFork className="w-3 h-3" aria-hidden /> {snapshot.counts.forks}
                </span>
              </span>
            </span>
          </a>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-[12px] text-fg-2 font-mono">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" aria-hidden />
              member since {friendlyDate(snapshot.profile.created_at)}
            </span>
            <SyncStatus status={snapshot.meta.status} fetchedAt={snapshot.meta.fetchedAt} label="GitHub API" />
          </div>
        </div>
        <div className="relative mt-6 flex items-start gap-3 border-l border-ok/50 pl-4 py-2">
          <ShieldCheck className="w-4 h-4 text-ok shrink-0 mt-0.5" aria-hidden />
          <p className="text-[13px] text-fg-1 leading-relaxed">
            Early public workspace — {snapshot.counts.stars} stars, {snapshot.counts.forks} forks, shown
            exactly as GitHub reports them. Code is being published progressively; no engineered numbers.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 border-y border-line py-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-2" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${visible.length} repositories…`}
            aria-label="Search repositories"
            className={`${filterInput} w-full pl-9`}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Filter by language"
            className={`${filterInput} min-w-[140px]`}
          >
            <option value="all">All languages</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            aria-label="Sort repositories"
            className={`${filterInput} min-w-[140px]`}
          >
            <option value="updated">Recently updated</option>
            <option value="name">Name A–Z</option>
            <option value="stars">Most stars</option>
            <option value="forks">Most forks</option>
          </select>
        </div>
      </div>

      <p className="text-[12px] text-fg-2 font-mono" aria-live="polite">
        {visible.length} of {snapshot.repos.length} repositories shown · sorted by{" "}
        {sortBy === "name" ? "name" : sortBy === "stars" ? "stars" : sortBy === "forks" ? "forks" : "recency"}
      </p>

      <div className="flex flex-col gap-3">
        {visible.map((repo) => (
          <a
            key={repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            data-outbound={`github:${repo.name}`}
            data-cursor="OPEN REPOSITORY"
            className="group block border-t border-line py-5 hover:bg-white/[0.025] transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg text-fg-0 group-hover:text-white transition-colors">
                {repo.name}
              </h3>
              <div className="flex items-center gap-3 text-[12px] font-mono text-fg-2 shrink-0">
                {typeof repo.stars === "number" && (
                  <span className="inline-flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" aria-hidden /> {repo.stars}
                  </span>
                )}
                {typeof repo.forks === "number" && (
                  <span className="inline-flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5" aria-hidden /> {repo.forks}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                </span>
              </div>
            </div>
            <p className="mt-2 text-[13.5px] text-fg-1 leading-relaxed">
              {repo.description || "No description — work in progress."}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-fg-2 font-mono">
              {repo.language && (
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: LANG_COLORS[repo.language] ?? "#7aa2ff" } as React.CSSProperties}
                    aria-hidden
                  />
                  {repo.language}
                </span>
              )}
              <span>updated {friendlyDate(repo.updated_at)}</span>
              {repo.topics?.slice(0, 3).map((t) => (
                <span key={t} className="text-fg-1">
                  #{t}
                </span>
              ))}
            </div>
          </a>
        ))}
        {visible.length === 0 && (
          <div className="border-y border-line p-8 text-center text-[13px] text-fg-2 font-mono">
            No repositories match “{query}”
            {lang !== "all" && ` in ${lang}`}. Clear the filters to see everything.
          </div>
        )}
      </div>
    </div>
  );
}

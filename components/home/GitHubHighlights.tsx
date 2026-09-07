"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SyncStatus from "../ui/SyncStatus";

type Snapshot = {
  username: string;
  profile: { public_repos: number; followers: number; following: number; created_at: string };
  counts: { stars: number; forks: number; languages: Record<string, number> };
  meta: { status: string; fetchedAt: string | null };
};

export default function GitHubHighlights() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

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
      <div className="flex items-center gap-2 min-h-[120px] text-[13px] text-fg-2 font-mono" aria-busy="true">
        <span className="inline-block w-3 h-3 rounded-full border border-white/30 animate-pulse" />
        awaiting GitHub sync…
      </div>
    );
  }

  if (state === "error" || !snapshot) {
    return (
      <div className="text-[13px] text-danger font-mono">
        GitHub unavailable — showing stored offline snapshot
      </div>
    );
  }

  const languages = Object.entries(snapshot.counts.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const status = snapshot.meta.status ?? "unavailable";
  const statusColor =
    status === "live" || status === "recent"
      ? "#34d399"
      : status === "stale" || status === "synced"
        ? "#f5b759"
        : "#9097a2";

  return (
    <div className="data-field chapter-github flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: statusColor }} aria-hidden />
          <span className="text-[13px] text-fg-0 font-mono tracking-wide">GITHUB / @{snapshot.username}</span>
        </div>
        <SyncStatus status={status} fetchedAt={snapshot.meta.fetchedAt} />
      </div>

      <div className="grid md:grid-cols-[1.2fr_2fr] gap-10 items-center">
        <div>
          <div className="font-display text-[clamp(4rem,10vw,8rem)] leading-none text-fg-0 tabular-nums">{snapshot.profile.public_repos}</div>
          <div className="mt-2 font-mono text-[11px] uppercase tracking-[.16em] text-sky">public repositories</div>
          <div className="mt-5 text-3xl text-fg-0 tabular-nums">{snapshot.counts.stars}<span className="ml-2 text-[11px] font-mono text-fg-2 uppercase tracking-[.12em]">stars / honest</span></div>
        </div>
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 min-h-[180px] items-center">
          <span className="absolute left-[8%] right-[8%] top-1/2 h-px bg-sky/30" aria-hidden />
          {languages.map(([lang, n], i) => (
            <div key={lang} className="relative z-[1] flex flex-col items-center gap-2 text-center" style={{ transform: `translateY(${i % 2 === 0 ? -22 : 22}px)` }}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-sky/50 bg-[#0d2031] text-xl text-sky">{n}</span>
              <span className="text-[12px] text-fg-0">{lang}</span>
              <span className="font-mono text-[10px] uppercase tracking-[.1em] text-fg-2">repos</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-2 text-[13px] text-fg-2 leading-relaxed max-w-[560px]">
        Early public account — no stars or followers yet, and I don&apos;t pad that. The
        flagship systems work ships here as it&apos;s published; namespaces stay honest in the
        meantime.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-line">
        <Link
          href="/github"
          className="inline-flex items-center gap-2 text-[14px] text-accent-soft hover:text-white transition-colors"
        >
          Browse repositories
          <ArrowUpRight className="w-4 h-4" aria-hidden />
        </Link>
        <span className="font-mono text-[11px] text-fg-2 uppercase tracking-[0.14em]">
          constellation · {snapshot.profile.public_repos} repos, live
        </span>
      </div>
    </div>
  );
}

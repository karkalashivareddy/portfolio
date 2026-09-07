"use client";

import { useEffect, useState } from "react";
import type { CodingPlatform } from "../../lib/types";
import { codingPlatformsUrl } from "../../data/coding";
import { useCountUp } from "../../hooks/useCountUp";
import { useInView } from "../../hooks/useInView";
import SyncStatus from "../ui/SyncStatus";

type Snapshot = {
  platforms: CodingPlatform[];
  aggregate: { totalSolved: number; platforms: number; contests: number; maxStreak: number; asOf: string };
  profileViews: number;
  meta: { status: string; fetchedAt: string | null };
};

function SolvedCount({ value }: { value: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const counted = useCountUp(value, inView, 900);
  return (
    <div ref={ref} className="font-display text-3xl text-fg-0 tabular-nums">
      {counted.toLocaleString("en-US")}
    </div>
  );
}

function DifficultyProportions({ easy, medium, hard, solvedTotal }: { easy: number; medium: number; hard: number; solvedTotal?: number }) {
  const total = easy + medium + hard;
  if (!total) return null;
  const pct = (n: number) => Math.round((n / total) * 100);
  const other = solvedTotal != null ? solvedTotal - total : 0;
  const segments = [
    { label: "Easy", count: easy, color: "#34d399" },
    { label: "Medium", count: medium, color: "#f5b759" },
    { label: "Hard", count: hard, color: "#f87171" },
  ].filter((s) => s.count > 0);
  return (
    <div>
      <div
        className="flex h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]"
        role="img"
        aria-label={`${easy} easy, ${medium} medium, ${hard} hard`}
      >
        {segments.map((s) => (
          <span
            key={s.label}
            className="h-full"
            style={{ width: `${(s.count / total) * 100}%`, background: s.color }}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-fg-2">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-[#34d399]" /> E {easy}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-[#f5b759]" /> M {medium}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-[#f87171]" /> H {hard}
        </span>
        {other > 0 && <span>+{other} other</span>}
        <span>[{pct(easy)} / {pct(medium)} / {pct(hard)}]</span>
      </div>
    </div>
  );
}

export default function CodingOverview() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/codolio")
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
        <span className="inline-block w-3 h-3 rounded-full border border-electric animate-pulse" />
        syncing Codolio…
      </div>
    );
  }

  if (state === "error" || !snapshot) {
    return (
      <div className="flex items-center gap-2 text-[13px] text-[#f87171] font-mono">
        Codolio unavailable — showing the stored 2026-09-06 snapshot
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SyncStatus status={snapshot.meta.status} fetchedAt={snapshot.meta.fetchedAt} label="Codolio" />
        <a
          href={codingPlatformsUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-outbound="codolio"
          className="text-[13px] text-accent-soft hover:text-fg-0 transition-colors"
        >
          verify all numbers on Codolio ↗
        </a>
      </div>

      {snapshot.platforms.map((p) => (
        <a
          key={p.platform}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          data-outbound={p.platform}
          className="group block py-7 border-b border-line hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ background: p.color }}
                  aria-hidden
                />
                <h3 className="font-display text-xl text-[#f2f4f7] capitalize">
                  {p.platform}
                </h3>
                {p.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#34d399]">
                    <span className="inline-block w-1 h-1 rounded-full bg-[#34d399]" aria-hidden />
                    live
                  </span>
                )}
              </div>
              <div className="mt-1 text-[13px] text-fg-2 font-mono">
                @{p.handle}
                {p.languages?.length ? ` · ${p.languages.join(", ")}` : ""}
              </div>
            </div>
            <div className="text-right">
              <SolvedCount value={p.solvedTotal ?? 0} />
              <div className="text-[11px] text-fg-2 font-mono uppercase tracking-wide">
                problems solved
              </div>
            </div>
          </div>

          {typeof p.rating === "number" && (
            <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-[13px] font-mono">
              <span className="text-[#a9b0bb]">Current <b className="text-[#f2f4f7]">{p.rating}</b></span>
              {typeof p.maxRating === "number" && (
                <span className="text-[#a9b0bb]">Max <b className="text-[#f2f4f7]">{p.maxRating}</b></span>
              )}
              {typeof p.dsaRating === "number" && (
                <span className="text-[#a9b0bb]">DSA <b className="text-[#f2f4f7]">{p.dsaRating}</b></span>
              )}
              {typeof p.contests === "number" && (
                <span className="text-[#a9b0bb]">{p.contests} contests</span>
              )}
              {typeof p.maxStreak === "number" && (
                <span className="text-[#a9b0bb]">streak {p.maxStreak}d</span>
              )}
            </div>
          )}

          {p.easy != null && p.medium != null && p.hard != null && (
            <DifficultyProportions easy={p.easy} medium={p.medium} hard={p.hard} solvedTotal={p.solvedTotal} />
          )}

          {p.badges && p.badges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.badges.map((b) => (
                <span
                  key={b}
                  className="px-2 py-0.5 rounded-md text-[11px] font-mono text-[#a9b0bb] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]"
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          {p.certificates && p.certificates.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.certificates.map((c) => (
                <span
                  key={c}
                  className="px-2 py-0.5 rounded-md text-[11px] font-mono text-[#34d399] bg-[rgba(52,211,153,0.07)] border border-[rgba(52,211,153,0.16)]"
                >
                  cert: {c}
                </span>
              ))}
            </div>
          )}
        </a>
      ))}
    </div>
  );
}

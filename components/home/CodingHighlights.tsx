"use client";

import { useEffect, useState, useId } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SyncStatus from "../ui/SyncStatus";
import { useInView } from "../../hooks/useInView";
import { useCountUp } from "../../hooks/useCountUp";
import { codechefRatingHistory } from "../../data/coding";
import type { CodingPlatform } from "../../lib/types";

type Snapshot = {
  source: string;
  platforms: CodingPlatform[];
  aggregate: { totalSolved: number; platforms: number; contests: number; maxStreak: number; asOf: string };
  meta: { status: string; fetchedAt: string | null };
};

function TotalMetric({ value }: { value: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const counted = useCountUp(value, inView, 1400);
  return (
    <span ref={ref} className="tabular-nums">
      {counted.toLocaleString("en-US")}
    </span>
  );
}

function CodeChefCurve() {
  const gradId = useId();
  const W = 760;
  const H = 220;
  const PAD = { top: 18, right: 28, bottom: 14, left: 8 };
  const ratings = codechefRatingHistory.map((r) => r.rating);
  const min = Math.floor(Math.min(...ratings) / 50) * 50;
  const max = Math.ceil(Math.max(...ratings) / 50) * 50;
  const span = max - min || 1;
  const x = (i: number) => PAD.left + (i / (ratings.length - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => H - PAD.bottom - ((v - min) / span) * (H - PAD.top - PAD.bottom);
  const points = ratings.map((r, i) => `${x(i)},${y(r)}`).join(" ");
  const area = `${PAD.left},${H - PAD.bottom} ${points} ${x(ratings.length - 1)},${H - PAD.bottom}`;
  const last = codechefRatingHistory[codechefRatingHistory.length - 1];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`CodeChef rating progression from ${ratings[0]} to ${ratings[ratings.length - 1]}, currently ${last.rating}`}
      className="w-full h-auto"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((t) => {
        const v = min + t * span;
        return (
          <line
            key={t}
            x1={PAD.left}
            x2={W - PAD.right}
            y1={y(v)}
            y2={y(v)}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="3 4"
          />
        );
      })}
      <polygon points={area} fill={`url(#${gradId})`} className="chart-fill" />
      <polyline
        points={points}
        fill="none"
        stroke="#67e8f9"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        pathLength={1}
        className="chart-draw"
      />
      {ratings.map((r, i) => (
        <circle
          key={i}
          cx={x(i)}
          cy={y(r)}
          r={i === ratings.length - 1 ? 3.5 : 1.6}
          fill={i === ratings.length - 1 ? "#fde68a" : "#a3e635"}
          opacity={i === ratings.length - 1 ? 1 : 0.55}
        />
      ))}
      <text x={PAD.left} y={y(max) - 6} fill="#8b93a0" fontSize="10" fontFamily="JetBrains Mono, monospace">
        {max}
      </text>
      <text x={x(ratings.length - 1) - 36} y={H - PAD.bottom + 10} fill="#8b93a0" fontSize="9" fontFamily="JetBrains Mono, monospace">
        {last.contest} · {last.rating}
      </text>
    </svg>
  );
}

export default function CodingHighlights() {
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
      <div className="flex items-center gap-2 min-h-[120px] text-[13px] text-fg-2 font-mono" aria-busy="true">
        <span className="inline-block w-3 h-3 rounded-full border border-white/30 animate-pulse" />
        awaiting Codolio sync…
      </div>
    );
  }

  if (state === "error" || !snapshot) {
    return (
      <div className="flex items-center gap-3 text-[13px] text-[#f87171] font-mono">
        Codolio unavailable — offline snapshot shown instead
      </div>
    );
  }

  const top = snapshot.platforms.slice(0, 5);
  const isFallback = snapshot.meta.status === "unavailable";
  const status = snapshot.meta.status ?? "unavailable";
  const statusColor =
    status === "live" || status === "recent"
      ? "#34d399"
      : status === "stale" || status === "synced"
        ? "#f5b759"
        : "#9097a2";

  return (
    <div className="data-field flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: statusColor }} aria-hidden />
          <span className="text-[13px] text-fg-0 font-mono tracking-wide">CODOIIO / LIVE</span>
        </div>
        <SyncStatus status={status} fetchedAt={snapshot.meta.fetchedAt} />
      </div>

      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="data-number font-display text-[64px] md:text-[84px] leading-none tracking-tight">
            <TotalMetric value={snapshot.aggregate.totalSolved} />
          </div>
          <div className="mt-3 text-[12px] text-fg-2 font-mono uppercase tracking-[0.14em]">
            Problems solved · sourced live
          </div>
        </div>
        <div className="flex flex-col gap-2 md:items-end text-[13px] font-mono text-fg-2">
          {!isFallback && (
            <>
              <span>
                <b className="text-fg-0">{snapshot.aggregate.platforms}</b> platforms
              </span>
              <span>
                <b className="text-fg-0">{snapshot.aggregate.contests}+</b> rated contests
              </span>
              <span>
                <b className="text-fg-0">{snapshot.aggregate.maxStreak}d</b> max streak
              </span>
            </>
          )}
        </div>
      </div>

      <div className="open-list grid md:grid-cols-5 gap-x-5 mt-2">
        {top.map((p) => (
          <a
            key={p.platform}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            data-outbound={p.platform}
            className="group flex items-center justify-between gap-2 py-3 transition-colors hover:text-white"
          >
            <div className="flex flex-col">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mb-1.5"
                style={{ background: p.color }}
                aria-hidden
              />
              <span className="text-[13px] text-fg-0 capitalize">{p.platform}</span>
              <span className="text-[11px] text-fg-2 font-mono">
                @{p.handle}
                {typeof p.rating === "number" && ` · ${p.rating}`}
              </span>
            </div>
            <div className="text-right">
              <div className="text-[15px] font-mono text-fg-0 tabular-nums">
                {p.solvedTotal ?? 0}
              </div>
              <ArrowUpRight className="ml-auto w-3.5 h-3.5 text-fg-2 group-hover:text-fg-0 transition-colors" />
            </div>
          </a>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-[14px] text-fg-0 font-medium">CodeChef rating curve</div>
            <span className="text-[11px] text-fg-2 font-mono">
              current <b className="text-accent-soft">{codechefRatingHistory[codechefRatingHistory.length - 1].rating}</b>
            </span>
          </div>
          <CodeChefCurve />
        </div>
      </div>

      <div className="mt-4">
        <Link
          href="/coding"
          className="inline-flex items-center gap-2 text-[14px] text-accent-soft hover:text-white transition-colors"
        >
          Full coding profile &amp; ratings history
          <ArrowUpRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

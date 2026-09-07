"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CodingPlatform } from "../../lib/types";
import { codingPlatformsFallback, codingPlatformsUrl, codingAggregate } from "../../data/coding";
import SyncStatus from "../ui/SyncStatus";

type Snapshot = {
  platforms: CodingPlatform[];
  aggregate: { totalSolved: number; platforms: number; contests: number; maxStreak: number; asOf: string };
  meta: { status: string; fetchedAt: string | null };
};

const primaryNames = ["CodeChef", "LeetCode"];
const secondaryNames = ["GeeksforGeeks", "HackerRank", "Codeforces"];
const displayNames: Record<string, string> = { codechef: "CodeChef", leetcode: "LeetCode", geeksforgeeks: "GeeksforGeeks", hackerrank: "HackerRank", codeforces: "Codeforces" };

function number(value?: number) {
  return typeof value === "number" ? value.toLocaleString("en-US") : "—";
}

function platformByName(platforms: CodingPlatform[], name: string) {
  return platforms.find((platform) => platform.platform.toLowerCase() === name.toLowerCase());
}

function PlatformProfile({ platform, primary }: { platform: CodingPlatform; primary?: boolean }) {
  const metrics = [
    ["solved", number(platform.solvedTotal)],
    ["rating", number(platform.rating)],
    ["max rating", number(platform.maxRating)],
    ["contests", number(platform.contests)],
    ...(typeof platform.dsaRating === "number" ? [["DSA rating", number(platform.dsaRating)]] : []),
    ...(typeof platform.maxStreak === "number" ? [["streak", `${number(platform.maxStreak)} days`]] : []),
  ];

  return (
    <article className={`coding-profile ${primary ? "coding-profile-primary" : ""}`} style={{ "--profile-accent": platform.color } as React.CSSProperties}>
      <div className="coding-profile-topline"><span>{primary ? "PRIMARY PROFILE" : "SECONDARY SIGNAL"}</span><a href={platform.url} target="_blank" rel="noopener noreferrer" data-outbound={`coding:${platform.platform}`} data-cursor="OPEN PROFILE">{displayNames[platform.platform.toLowerCase()] ?? platform.platform} <ArrowUpRight size={14} aria-hidden /></a></div>
      <div className="coding-profile-heading"><div><h3>{displayNames[platform.platform.toLowerCase()] ?? platform.platform}</h3><p>@{platform.handle}</p></div><span className="coding-profile-orb" aria-hidden /></div>
      <dl className="coding-profile-metrics">{metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      {platform.easy || platform.medium || platform.hard ? <div className="coding-difficulty" aria-label={`${platform.platform} difficulty breakdown`}>{["easy", "medium", "hard"].map((level) => <span key={level}><i className={`coding-difficulty-${level}`} /><b>{level}</b><em>{number(platform[level as "easy" | "medium" | "hard"])}</em></span>)}</div> : null}
    </article>
  );
}

export default function CodingRouteLive({ points }: { points: string }) {
  const [snapshot, setSnapshot] = useState<Snapshot>({ platforms: codingPlatformsFallback, aggregate: codingAggregate, meta: { status: "unavailable", fetchedAt: null } });

  useEffect(() => {
    let active = true;
    fetch("/api/codolio")
      .then((response) => response.ok ? response.json() as Promise<Snapshot> : Promise.reject(new Error("Codolio unavailable")))
      .then((next) => { if (active) setSnapshot(next); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const primary = primaryNames.map((name) => platformByName(snapshot.platforms, name)).filter(Boolean) as CodingPlatform[];
  const secondary = secondaryNames.map((name) => platformByName(snapshot.platforms, name)).filter(Boolean) as CodingPlatform[];
  const total = snapshot.aggregate.totalSolved || 1;
  const codechef = platformByName(snapshot.platforms, "CodeChef");
  const leetcode = platformByName(snapshot.platforms, "LeetCode");
  const dsaNodes = [["AVL TREES", "rotation / balance"], ["B+ TREES", "index / hierarchy"], ["GRAPHS", "paths / structure"], ["BFS / DFS", "traversal / reachability"], ["MST", "edges / selection"], ["PRIM", "greedy growth"], ["KRUSKAL", "edge selection"], ["COMPLEXITY", "reasoning / trade-offs"]];
  const distribution = useMemo(() => snapshot.platforms.filter((platform) => typeof platform.solvedTotal === "number"), [snapshot.platforms]);

  return (
    <div className="coding-archive">
      <section className="coding-hero" aria-labelledby="coding-identity">
        <div className="coding-hero-copy"><p className="world-kicker"><span>01</span> / CODING IDENTITY / PRACTICE AS PROOF</p><h2 id="coding-identity">The signal<br /><i>keeps moving.</i></h2><p className="coding-hero-lead">A public record of problem solving across five platforms — the repetition behind the systems work.</p><div className="coding-hero-status"><SyncStatus status={snapshot.meta.status} fetchedAt={snapshot.meta.fetchedAt} label="Codolio" /><a href={codingPlatformsUrl} target="_blank" rel="noopener noreferrer" data-cursor="OPEN SOURCE">Open source profile <ArrowUpRight size={14} /></a></div><div className="coding-hero-number-wrap"><div className="coding-hero-number" aria-label={`${snapshot.aggregate.totalSolved.toLocaleString()} problems solved`}>{snapshot.aggregate.totalSolved.toLocaleString("en-US")}</div><p>PROBLEMS SOLVED</p><div className="coding-hero-facts"><span>{snapshot.aggregate.platforms} PLATFORMS</span><span>{snapshot.aggregate.contests}+ RATED CONTESTS</span><span>{snapshot.aggregate.maxStreak}-DAY LONGEST STREAK</span></div></div></div>
        <div className="coding-hero-art" aria-hidden="true"><svg viewBox="0 0 520 360" role="presentation"><defs><linearGradient id="coding-signal-gradient" x1="0" x2="1"><stop stopColor="#65dedb" /><stop offset=".55" stopColor="#7aa2ff" /><stop offset="1" stopColor="#ed8fc8" /></linearGradient></defs><path d="M24 292 C100 280 105 250 164 238 S237 199 276 212 S338 178 376 133 S431 83 496 44" fill="none" stroke="url(#coding-signal-gradient)" strokeWidth="2" /><path d="M24 292 C100 280 105 250 164 238 S237 199 276 212 S338 178 376 133 S431 83 496 44" fill="none" stroke="#65dedb" strokeOpacity=".15" strokeWidth="18" />{[24,164,276,376,496].map((x, index) => <circle key={x} cx={x} cy={[292,238,212,133,44][index]} r={index === 4 ? 7 : 4} fill={index === 4 ? "#f5b759" : "#65dedb"} />)}<text x="24" y="326">REPETITION</text><text x="390" y="28">TRAJECTORY</text></svg><span className="coding-hero-art-label">PRACTICE / CONTINUOUS</span></div>
      </section>

      <section className="coding-chapter coding-platform-chapter" aria-labelledby="coding-platforms-title"><div className="coding-chapter-heading"><p className="world-kicker"><span>02</span> / PLATFORMS / DISTINCT SIGNALS</p><h2 id="coding-platforms-title">Two primary<br /><i>ways of thinking.</i></h2><p>CodeChef carries the contest trajectory. LeetCode carries a second practice rhythm. The smaller profiles complete the picture without pretending they are the same kind of evidence.</p></div><div className="coding-primary-grid">{primary.map((platform) => <PlatformProfile key={platform.platform} platform={platform} primary />)}</div><div className="coding-secondary-row">{secondary.map((platform) => <PlatformProfile key={platform.platform} platform={platform} />)}</div></section>

      <section className="coding-chapter coding-trajectory-chapter" aria-labelledby="codechef-title"><div className="coding-chapter-heading coding-chapter-heading-split"><div><p className="world-kicker"><span>03</span> / CODECHEF / RATING TRAJECTORY</p><h2 id="codechef-title">A curve is<br /><i>better than a badge.</i></h2></div><p>The verified CodeChef history moves from 623 to 1455 across the recorded contests. The line is the story; the endpoint is only the latest frame.</p></div><div className="coding-trajectory-art"><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="CodeChef rating progression from 623 to 1455"><defs><linearGradient id="trajectory-line" x1="0" x2="1"><stop stopColor="#65dedb" /><stop offset=".6" stopColor="#7aa2ff" /><stop offset="1" stopColor="#f5b759" /></linearGradient></defs><polyline points={points} fill="none" stroke="url(#trajectory-line)" strokeWidth="1.1" vectorEffect="non-scaling-stroke" /></svg><div className="coding-trajectory-glow" aria-hidden="true" /><div className="coding-trajectory-axis"><span>623 / SEP 2025</span><span>1455 / AUG 2026</span></div></div><ol className="coding-milestones" aria-label="Selected CodeChef rating milestones"><li><b>623</b><span>first recorded point</span></li><li><b>1108</b><span>Starters 216</span></li><li><b>1400</b><span>Starters 236</span></li><li><b>1455</b><span>latest recorded point</span></li></ol></section>

      <section className="coding-chapter coding-comparison" aria-labelledby="comparison-title"><div className="coding-chapter-heading"><p className="world-kicker"><span>04</span> / COMPARISON / TWO SIGNALS</p><h2 id="comparison-title">Different arenas.<br /><i>Same discipline.</i></h2></div><div className="coding-comparison-grid">{[codechef, leetcode].filter(Boolean).map((platform) => <article key={platform!.platform} className="coding-comparison-line" style={{ "--profile-accent": platform!.color } as React.CSSProperties}><div><span>{platform!.platform}</span><b>{number(platform!.rating)}</b></div><div className="coding-comparison-rule"><i style={{ width: `${Math.min(100, ((platform!.rating ?? 0) / 1800) * 100)}%` }} /></div><p>{number(platform!.solvedTotal)} solved · {number(platform!.contests)} contests{typeof platform!.maxStreak === "number" ? ` · ${number(platform!.maxStreak)}-day streak` : ""}</p></article>)}</div></section>

      <section className="coding-chapter coding-problem-chapter" aria-labelledby="problem-solving-title"><div className="coding-chapter-heading coding-chapter-heading-split"><div><p className="world-kicker"><span>05</span> / PROBLEM SOLVING / DISTRIBUTION</p><h2 id="problem-solving-title">Practice leaves<br /><i>a shape.</i></h2></div><p>The total is distributed across the verified platform snapshot. Bars are calculated from the displayed solved counts, not a separate achievement claim.</p></div><div className="coding-distribution" role="list" aria-label="Solved problem distribution by platform">{distribution.map((platform) => <div className="coding-distribution-row" role="listitem" key={platform.platform}><div className="coding-distribution-label"><span>{platform.platform}</span><b>{number(platform.solvedTotal)}</b></div><div className="coding-distribution-track"><i style={{ width: `${((platform.solvedTotal ?? 0) / total) * 100}%`, background: platform.color }} /></div><small>{Math.round(((platform.solvedTotal ?? 0) / total) * 100)}% of displayed total</small></div>)}</div></section>

      <section className="coding-chapter coding-dsa-chapter" aria-labelledby="dsa-title"><div className="coding-chapter-heading"><p className="world-kicker"><span>06</span> / DSA / CONCEPT MAP</p><h2 id="dsa-title">Structures before<br /><i>shortcuts.</i></h2><p>This is a conceptual map anchored in the DSA-2 work and engineering graph. No topic counts are implied.</p></div><div className="coding-dsa-map"><div className="coding-dsa-spine" aria-hidden="true" />{dsaNodes.map(([title, note], index) => <div className={`coding-dsa-node coding-dsa-node-${index + 1}`} key={title} tabIndex={0} data-cursor="INSPECT"><span>{String(index + 1).padStart(2, "0")}</span><b>{title}</b><small>{note}</small></div>)}</div><div className="coding-dsa-caption"><span>LINEAR STRUCTURES</span><ArrowDownRight size={16} /><span>TREES</span><ArrowDownRight size={16} /><span>GRAPHS / BFS / DFS / MST</span></div></section>

      <section className="coding-chapter coding-consistency" aria-labelledby="consistency-title"><div className="coding-consistency-copy"><p className="world-kicker"><span>07</span> / CONSISTENCY / KEEP GOING</p><h2 id="consistency-title">The useful part<br /><i>is returning.</i></h2><p>{snapshot.aggregate.maxStreak}-day longest streak, {snapshot.aggregate.contests}+ rated contests, and a practice record that is still being updated. This page is evidence of the habit — not a promise about the future.</p></div><div className="coding-consistency-stamp" aria-hidden="true"><span>{snapshot.aggregate.maxStreak}</span><small>DAYS<br />LONGEST<br />STREAK</small></div></section>
      <Link className="coding-next" href="/projects" data-cursor="VIEW WORK"><span><small>08 / NEXT</small> Back to the systems.</span><ArrowUpRight size={22} aria-hidden /></Link>
    </div>
  );
}

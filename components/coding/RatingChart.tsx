"use client";

import { useId } from "react";
import { codechefRatingHistory } from "../../data/coding";

export default function RatingChart() {
  const gradId = useId();
  const W = 760;
  const H = 240;
  const PAD = { top: 16, right: 8, bottom: 28, left: 8 };

  const ratings = codechefRatingHistory.map((r) => r.rating);
  const min = Math.floor(Math.min(...ratings) / 50) * 50;
  const max = Math.ceil(Math.max(...ratings) / 50) * 50;
  const span = max - min || 1;

  const x = (i: number) => PAD.left + (i / (ratings.length - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => H - PAD.bottom - ((v - min) / span) * (H - PAD.top - PAD.bottom);

  const points = ratings.map((r, i) => `${x(i)},${y(r)}`).join(" ");
  const area = `${PAD.left},${H - PAD.bottom} ${points} ${x(ratings.length - 1)},${H - PAD.bottom}`;

  const gridLines = [0, 0.5, 1].map((t) => {
    const value = min + t * span;
    return (
      <line
        key={t}
        x1={PAD.left}
        x2={W - PAD.right}
        y1={y(value)}
        y2={y(value)}
        stroke="rgba(255,255,255,0.07)"
        strokeDasharray="3 4"
      />
    );
  });

  const last = codechefRatingHistory[codechefRatingHistory.length - 1];

  return (
    <figure className="data-field">
      <figcaption className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-[14px] text-[#f2f4f7] font-medium">CodeChef rating curve</div>
          <div className="text-[12px] text-fg-2 font-mono">
            Starters 202 → 254 · current {last.rating}
          </div>
        </div>
        <span className="text-[11px] text-fg-2 font-mono">
          source: Codolio snapshot 2026-09-16
        </span>
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`CodeChef rating progression from ${ratings[0]} to ${ratings[ratings.length - 1]}`}
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5b759" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f5b759" stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridLines}
        <polygon points={area} fill={`url(#${gradId})`} />
        <polyline
          points={points}
          fill="none"
          stroke="#f5b759"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {ratings.map((r, i) => (
          <circle
            key={i}
            cx={x(i)}
            cy={y(r)}
            r={i === ratings.length - 1 ? 3.5 : 2}
            fill={i === ratings.length - 1 ? "#fde68a" : "#f5b759"}
          />
        ))}
        <text x={PAD.left} y={y(max) - 6} fill="#9097a2" fontSize="10" fontFamily="JetBrains Mono">
          {max}
        </text>
        <text x={PAD.left} y={H - PAD.bottom + 16} fill="#9097a2" fontSize="10" fontFamily="JetBrains Mono">
          {codechefRatingHistory[0].contest} ({ratings[0]})
        </text>
        <text x={x(ratings.length - 1) - 40} y={H - PAD.bottom + 16} fill="#9097a2" fontSize="10" fontFamily="JetBrains Mono">
          {last.contest} ({last.rating})
        </text>
      </svg>
    </figure>
  );
}

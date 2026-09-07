"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { engineeringGraph } from "../../data/engineeringGraph";
import { useInView } from "../../hooks/useInView";

const SIZE = 640;
const nodes = engineeringGraph.nodes;
const nodeById = new Map(nodes.map((n) => [n.id, n]));

/** Spatial reading of the real engineering graph: layered planes imply depth,
 * paths imply flow, and labels name the actual domains behind the portfolio. */
export default function EngineerGraph() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const visualRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState("me");
  const active = nodeById.get(activeId) ?? nodes[0];

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || !visualRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    visualRef.current.style.setProperty("--rx", `${y * -6}deg`);
    visualRef.current.style.setProperty("--ry", `${x * 7}deg`);
  };

  const resetTilt = () => {
    visualRef.current?.style.setProperty("--rx", "0deg");
    visualRef.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <div ref={ref} className="flex flex-col gap-5">
      <div className="core-stage" onPointerMove={onPointerMove} onPointerLeave={resetTilt} data-cursor="EXPLORE CORE">
        <div ref={visualRef} className={`core-visual ${inView ? "drawn" : ""}`}>
          <span className="core-caption a">engineering / 01</span>
          <span className="core-caption b">data in motion</span>
          <span className="core-caption c">systems / algorithms</span>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-auto select-none" role="group" aria-label="Interactive engineering core showing systems, data, algorithms, and product domains">
            <polygon className="core-plane back" points="116,114 494,74 558,432 176,492" />
            <polygon className="core-plane front" points="88,144 466,104 530,462 148,522" />
            {Array.from({ length: 7 }, (_, i) => (
              <line key={`h-${i}`} className="core-gridline" x1={120 + i * 9} y1={160 + i * 49} x2={491 + i * 3} y2={121 + i * 49} />
            ))}
            {Array.from({ length: 7 }, (_, i) => (
              <line key={`v-${i}`} className="core-gridline" x1={120 + i * 58} y1="160" x2={158 + i * 58} y2="510" />
            ))}
            <ellipse className="core-orbit" cx="310" cy="312" rx="230" ry="110" transform="rotate(-24 310 312)" />
            <ellipse className="core-orbit violet" cx="310" cy="312" rx="188" ry="82" transform="rotate(38 310 312)" />
            <path className="core-flow" d="M130 395 C210 235, 270 440, 350 276 S460 207, 512 350" />
            <path className="core-flow" d="M160 210 C230 320, 330 174, 438 378" opacity=".48" />
            <g className="core-node" role="button" tabIndex={0} aria-label="Core — the engineering center" onMouseEnter={() => setActiveId("me")} onFocus={() => setActiveId("me")} onClick={() => setActiveId("me")}>
              <circle cx="310" cy="312" r="38" fill="rgba(101, 224, 231, .08)" stroke="rgba(101,224,231,.4)" />
              <circle cx="310" cy="312" r="14" fill="#71e7e9" />
              <text x="310" y="356" textAnchor="middle">ENGINEERING CORE</text>
            </g>
            {nodes.filter((n) => n.id !== "me").map((n) => {
              const cx = 116 + n.x * 390;
              const cy = 132 + n.y * 345;
              const activeNear = activeId === n.id;
              return (
                <g key={n.id} className={`core-node ${activeNear ? "is-active" : ""}`} role="button" tabIndex={0} aria-label={`${n.label} — ${n.sub}`} onMouseEnter={() => setActiveId(n.id)} onFocus={() => setActiveId(n.id)} onClick={() => setActiveId(n.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveId(n.id); } }}>
                  <circle cx={cx} cy={cy} r={activeNear ? 12 : 8} fill={`${n.color}22`} stroke={n.color} />
                  <circle cx={cx} cy={cy} r={activeNear ? 5 : 3.5} fill={n.color} />
                  <text x={cx} y={cy + (n.y > .58 ? -16 : 23)} textAnchor="middle">{n.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      <div className="flex items-start justify-between gap-6 border-t border-line pt-4" aria-live="polite">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan">active layer / {active.sub}</div>
          <div className="mt-1 font-display text-xl text-fg-0">{active.label}</div>
        </div>
        <div className="flex max-w-[230px] flex-wrap justify-end gap-x-4 gap-y-2 text-right">
          {active.links.map((link) => link.external ? (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" data-outbound={`graph:${active.id}`} className="inline-flex items-center gap-1 text-[12px] text-fg-1 hover:text-white transition-colors">{link.label}<ArrowUpRight className="w-3 h-3" aria-hidden /></a>
          ) : (
            <Link key={link.href} href={link.href} className="text-[12px] text-fg-1 hover:text-white transition-colors">{link.label}</Link>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-fg-2 font-mono tracking-[.12em] uppercase">hover / focus a node to change the field</p>
    </div>
  );
}

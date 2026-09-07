"use client";

import { useState } from "react";
import Reveal from "../ui/Reveal";
import SectionHeader from "../ui/SectionHeader";
import { skillCategories, codingSkillsNote } from "../../data/skills";

export default function Capabilities() {
  const [active, setActive] = useState<{ name: string; note: string } | null>(null);
  const columns = [
    skillCategories.filter((c) => ["Languages", "Frontend"].includes(c.title)),
    skillCategories.filter((c) => ["Backend & Systems", "Databases"].includes(c.title)),
    skillCategories.filter((c) => ["Tools", "Currently learning"].includes(c.title)),
  ];
  const grouped = columns.map((cats, ci) =>
    cats.map((cat, i) => ({
      cat,
      ci,
      gi: columns.slice(0, ci).reduce((n, x) => n + x.length, 0) + i + 1,
    }))
  );

  return (
    <section id="capabilities" className="chapter-scene chapter-systems py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <SectionHeader
            index="04"
            label="SYSTEMS"
            title="Systems & capabilities"
            description="A colour-coded inventory of the stack behind the build — each domain mapped to the work it ships in."
          />
        </Reveal>

        <div className="grid md:grid-cols-3 gap-10 md:gap-6 lg:gap-10">
          {grouped.map((cats, ci) => (
            <Reveal key={ci} delay={ci * 80} className="flex flex-col gap-10 md:gap-6 lg:gap-10">
              {cats.map(({ cat, gi }) => (
                <div key={cat.title}>
                  <div className="flex items-end justify-between gap-3 border-b border-line pb-3">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] tabular-nums" style={{ color: cat.color }}>
                        {String(gi).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-lg text-fg-0">{cat.title}</h3>
                    </div>
                    <span className="font-mono text-[10px] text-fg-2 uppercase tracking-[0.12em] whitespace-nowrap">
                      {cat.items.length} capabilities
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] text-fg-2 font-mono">{cat.note}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        title={item.note}
                        onMouseEnter={() => setActive(item)}
                        onFocus={() => setActive(item)}
                        onClick={() => setActive(item)}
                        style={{ borderColor: `color-mix(in srgb, ${cat.color} 26%, transparent)` }}
                        className="border-b px-0.5 py-1 text-left text-[12px] text-[#e7e9ed] hover:text-white hover:border-white transition-all duration-200"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 min-h-[58px] border-l border-[#a78bfa]/60 pl-4" aria-live="polite">
            <div className="font-mono text-[10px] uppercase tracking-[.16em] text-[#a78bfa]">inventory focus</div>
            <p className="mt-1 text-[13px] text-fg-1">{active ? <><span className="text-fg-0">{active.name}</span> — {active.note}</> : "Hover or focus a technology to see where it enters the build."}</p>
          </div>
        </Reveal>

        <Reveal>
          <p className="mt-8 text-[13px] text-fg-2 font-mono">{codingSkillsNote}</p>
        </Reveal>
      </div>
    </section>
  );
}

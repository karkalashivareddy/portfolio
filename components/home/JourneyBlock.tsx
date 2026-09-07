import Reveal from "../ui/Reveal";
import SectionHeader from "../ui/SectionHeader";
import TimelineRail from "./TimelineRail";
import { timeline } from "../../data/timeline";

export default function JourneyBlock() {
  const currentYear = new Date().getFullYear();
  return (
    <section id="journey" className="chapter-scene chapter-journey py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-14 lg:items-start">
          <div className="relative pl-6 sm:pl-8">
            <TimelineRail />
            <ul className="flex flex-col">
              {timeline.map((entry, i) => {
                const isNow = i === timeline.length - 1;
                return (
                  <li key={i} className="relative pb-10 last:pb-0">
                    <span
                      className={`absolute -left-[15px] sm:-left-[19px] top-[5px] w-[10px] sm:w-[14px] h-[10px] sm:h-[14px] rounded-full border-2 bg-wall ${
                        isNow ? "border-[#e879f9] shadow-[0_0_14px_rgba(232,121,249,0.6)]" : "border-line-strong"
                      }`}
                      aria-hidden
                    >
                      {isNow && <span className="absolute inset-[3px] rounded-full bg-[#e879f9]" aria-hidden />}
                    </span>
                    <Reveal delay={i * 40}>
                      <div className={i < timeline.length - 1 ? "pb-10 border-b border-line" : "pb-0"}>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="text-[12px] font-mono text-[#e879f9]">{entry.date}</span>
                          <span className="text-[11px] font-mono text-fg-2 uppercase tracking-wide">
                            {entry.kind}
                          </span>
                          <span className="ml-auto text-[11px] font-mono text-fg-2">{entry.source}</span>
                        </div>
                        <h3 className="mt-2 font-display text-lg text-fg-0">{entry.title}</h3>
                        <p className="mt-1.5 text-[13.5px] text-fg-1 leading-relaxed max-w-[560px]">
                          {entry.detail}
                        </p>
                        {isNow && (
                          <div className="mt-3 inline-flex items-center gap-2 text-[11px] font-mono text-fg-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" aria-hidden />
                            you are here — the field is still being built
                          </div>
                        )}
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="hidden lg:block lg:sticky lg:top-[96px] self-start max-w-[360px]">
            <Reveal>
              <SectionHeader
                index="07"
                label="JOURNEY"
                title="The timeline so far"
                description={`Only dated, traceable events (${timeline.length} entries). Every entry cites its source — the trajectory is a spiral, not a straight line.`}
              />
            </Reveal>
            <Reveal delay={80}>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-2">
                now · {currentYear}
              </p>
              <p className="text-[13px] text-fg-1 leading-relaxed">
                This portfolio is a live engineering artifact — the same discipline
                it documents, published as I build it.
              </p>
            </Reveal>
          </aside>
        </div>

        <div className="lg:hidden mt-10">
          <Reveal>
            <SectionHeader
              index="07"
              label="JOURNEY"
              title="The timeline so far"
              description="Only dated, traceable events. Every entry cites its source."
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

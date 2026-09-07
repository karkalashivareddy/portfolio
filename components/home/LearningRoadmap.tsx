import Link from "next/link";
import Reveal from "../ui/Reveal";
import SectionHeader from "../ui/SectionHeader";
import { profile } from "../../data/profile";

const GOAL_NOTES: Record<string, string> = {
  "Spring Boot": "Next backend framework",
  Docker: "Containers & dev environments",
  "Distributed systems": "Consistency, reliability",
  "System design": "Scaling patterns",
  Cloud: "AWS / deployment fundamentals",
};

export default function LearningRoadmap() {
  return (
    <section id="learning" className="chapter-scene chapter-learning py-14 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <SectionHeader
            index="08"
            label="LEARNING"
            title="Currently learning"
            description="The engineering roadmap — listed as goals, not claimed as skills. When a project or certificate proves it, it moves up."
          />
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8 lg:gap-x-5">
          {profile.goals.map((goal, i) => (
            <Reveal key={goal} delay={i * 60}>
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between border-b border-line pb-2.5">
                  <span className="text-[10px] font-mono text-[#a3e635] uppercase tracking-wide inline-flex items-center gap-1.5">
                    <span className="status-dot live" aria-hidden /> roadmap
                  </span>
                  <span className="text-[10px] font-mono text-fg-2" aria-hidden>
                    N{i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </span>
                </div>
                <div className="mt-3 font-display text-[15px] text-fg-0 leading-snug">
                  {goal}
                </div>
                <p className="mt-1.5 text-[12px] text-fg-2 leading-relaxed">
                  {GOAL_NOTES[goal] ?? "On the roadmap — shipped work lands here"}
                </p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={profile.goals.length * 60}>
            <div className="h-full flex flex-col items-center justify-center rounded border border-dashed border-line-strong p-4 text-center">
              <span className="text-[12px] font-mono text-fg-2 leading-relaxed">
                the map continues beyond the horizon
              </span>
              <span className="mt-1.5 text-[11px] font-mono text-fg-2/80 leading-relaxed">
                shipped work promotes each node into the Systems inventory above
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[14px] text-accent-soft hover:text-white transition-colors"
            >
              The full story on About →
            </Link>
            <span className="text-[11px] font-mono text-fg-2">
              09 · the origin story
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

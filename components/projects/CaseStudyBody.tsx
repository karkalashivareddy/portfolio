import { CheckCircle2, GitBranch, Lightbulb, Target, Scale } from "lucide-react";
import type { CaseStudy } from "../../lib/types";

function MarkdownBlock({ children }: { children: React.ReactNode }) {
  return <p className="text-[14.5px] text-fg-1 leading-[1.75]">{children}</p>;
}

function NarrativeHeading({
  num,
  label,
  icon,
}: {
  num: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <h3 className="flex items-center gap-3 mb-4">
      <span className="font-mono text-[12px] tracking-wide text-accent shrink-0">{num}</span>
      <span className="inline-flex items-center gap-2 text-fg-0 font-display text-lg">
        {icon}
        {label}
      </span>
      <span className="h-px flex-1 bg-line" aria-hidden />
    </h3>
  );
}

export default function CaseStudyBody({ study }: { study: CaseStudy }) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        {study.overview.map((p, i) => (
          <MarkdownBlock key={i}>{p}</MarkdownBlock>
        ))}
      </div>

      {study.architecture && (
        <div>
          <NarrativeHeading
            num="03"
            label="Architecture"
            icon={<span className="w-2 h-2 rounded-sm bg-accent block" aria-hidden />}
          />
          <pre className="code-frame overflow-x-auto text-[12.5px] leading-relaxed text-fg-1 p-5">
            {study.architecture}
          </pre>
        </div>
      )}

      {study.stack && study.stack.length > 0 && (
        <div>
          <NarrativeHeading
            num="04"
            label="Stack"
            icon={<span className="w-2 h-2 rounded-sm bg-accent-cyan block" aria-hidden />}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            {study.stack.map((group) => (
              <div key={group.category} className="card p-4">
                <div className="text-[12px] font-mono text-fg-2 uppercase tracking-wide">
                  {group.category}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 rounded-md text-[12px] text-fg-0 bg-white/[0.04] border border-line"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <section aria-label="Features">
        <NarrativeHeading
          num="05"
          label="What it does"
          icon={<CheckCircle2 className="w-4.5 h-4.5 text-accent" aria-hidden />}
        />
        <ul className="flex flex-col gap-2">
          {study.features.map((f, i) => (
            <li key={i} className="flex gap-3 text-[14.5px] text-fg-1 leading-relaxed">
              <span className="w-1.5 h-1.5 mt-[9px] rounded-sm bg-accent shrink-0 block" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Engineering decisions">
        <NarrativeHeading
          num="06"
          label="Engineering decisions"
          icon={<GitBranch className="w-4.5 h-4.5 text-accent-green" aria-hidden />}
        />
        <ul className="flex flex-col gap-2">
          {study.engineeringDecisions.map((d, i) => (
            <li key={i} className="flex gap-3 text-[14.5px] text-fg-1 leading-relaxed">
              <span className="w-1.5 h-1.5 mt-[9px] rounded-sm bg-accent-green shrink-0 block" aria-hidden />
              {d}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Challenges">
        <NarrativeHeading
          num="07"
          label="Challenges"
          icon={<Target className="w-4.5 h-4.5 text-warn" aria-hidden />}
        />
        <ul className="flex flex-col gap-2">
          {study.challenges.map((c, i) => (
            <li key={i} className="flex gap-3 text-[14.5px] text-fg-1 leading-relaxed">
              <span className="w-1.5 h-1.5 mt-[9px] rounded-sm bg-warn shrink-0 block" aria-hidden />
              {c}
            </li>
          ))}
        </ul>
      </section>

      {study.tradeoffs && study.tradeoffs.length > 0 && (
        <section aria-label="Trade-offs">
          <NarrativeHeading
            num="08"
            label="Trade-offs"
            icon={<Scale className="w-4.5 h-4.5 text-danger" aria-hidden />}
          />
          <ul className="flex flex-col gap-2">
            {study.tradeoffs.map((t, i) => (
              <li key={i} className="flex gap-3 text-[14.5px] text-fg-1 leading-relaxed">
                <span className="w-1.5 h-1.5 mt-[9px] rounded-sm bg-danger shrink-0 block" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label="Lessons learned">
        <NarrativeHeading
          num="09"
          label="Lessons learned"
          icon={<Lightbulb className="w-4.5 h-4.5 text-accent-soft" aria-hidden />}
        />
        <ul className="flex flex-col gap-2">
          {study.lessons.map((l, i) => (
            <li key={i} className="flex gap-3 text-[14.5px] text-fg-1 leading-relaxed">
              <span className="w-1.5 h-1.5 mt-[9px] rounded-sm bg-accent-soft shrink-0 block" aria-hidden />
              {l}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
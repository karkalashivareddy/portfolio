import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { verifiedNumbers } from "../../data/profile";
import { codingAggregate } from "../../data/coding";
import TelemetryReadout from "../ui/TelemetryReadout";
import Reveal from "../ui/Reveal";

/** SIGNAL — the moment the field detects its own telemetry. One dominant
 *  reading (2,531), subordinate telemetry aligned beneath, live portfolio
 *  signal in the header. The numbers take colour from the cyan/sky family via
 *  the ambient chapter field rather than sitting in grey cards. */
export default function ProofStrip() {
  const rows = [
    { value: verifiedNumbers.platforms, valueSuffix: "", label: "platforms", dot: "#22d3ee" },
    { value: codingAggregate.contests, valueSuffix: "+", label: "rated contests across CodeChef + LeetCode", dot: "#38bdf8" },
    { value: verifiedNumbers.codechefContests, valueSuffix: "+", label: "CodeChef rated contests", dot: "#7aa2ff" },
    { value: verifiedNumbers.codingStreakDays, valueSuffix: " d", label: "longest streak", dot: "#a3e635" },
  ];

  return (
    <section id="signal" className="chapter-scene chapter-signal data-field">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 py-16 md:py-24">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            <div className="flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.16em] text-fg-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" aria-hidden />
              TX/02 · SYSTEM SIGNAL
            </div>
            <TelemetryReadout />
          </div>
        </Reveal>

        <div className="mt-14 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] gap-12 lg:gap-16 lg:items-end">
          <span className="data-orbit" aria-hidden />
          <div>
            <Reveal delay={60}>
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-2">
                primary signal · problems solved
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div
                className="data-number mt-4 font-display tabular-nums"
                aria-label={`${verifiedNumbers.problemsSolved.toLocaleString("en-US")} problems solved across five platforms`}
              >
                {verifiedNumbers.problemsSolved.toLocaleString("en-US")}
              </div>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-8 flex items-center gap-3 max-w-[460px]" aria-hidden>
                <span className="signal-track">
                  <span className="signal-pulse" />
                </span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-2">
                  signal locked
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <dl className="flex flex-col">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center gap-3 py-3 border-b border-line last:border-0 group"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                    style={{ background: row.dot }}
                    aria-hidden
                  />
                  <dd className="font-mono text-[18px] text-fg-0 tabular-nums tracking-tight">
                    {row.value}
                    {row.valueSuffix}
                  </dd>
                  <dt className="ml-auto text-[12px] font-mono text-fg-2 text-right">{row.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={220}>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line pt-6">
            <span className="text-[12px] font-mono text-fg-2">
              every number links to its source on Codolio
            </span>
            <span className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a
                href="https://codolio.com/profile/2520030105"
                target="_blank"
                rel="noopener noreferrer"
                data-outbound="codolio"
                className="group inline-flex items-center gap-1.5 text-[13px] text-fg-1 hover:text-white transition-colors"
              >
                view source on Codolio
                <ExternalLink className="w-3.5 h-3.5 text-fg-2 group-hover:text-fg-0 transition-colors" aria-hidden />
              </a>
              <Link
                href="/coding"
                className="inline-flex items-center gap-1.5 text-[13px] text-sky hover:text-white transition-colors"
              >
                the full curve →
              </Link>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

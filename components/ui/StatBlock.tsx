"use client";

import { useCountUp } from "../../hooks/useCountUp";
import { useInView } from "../../hooks/useInView";
import { formatCompact } from "../../lib/format";

type Props = {
  value: number;
  label: string;
  source?: string;
  compact?: boolean;
  suffix?: string;
};

export default function StatBlock({ value, label, source, compact, suffix }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const counted = useCountUp(value, inView);

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <div className="font-display text-3xl md:text-4xl text-fg-0 tracking-tight tabular-nums">
        {compact ? formatCompact(value) : counted.toLocaleString("en-US")}
        {suffix ? <span className="text-accent">{suffix}</span> : null}
      </div>
      <div className="text-[13px] text-fg-1">{label}</div>
      {source && <div className="text-[11px] text-fg-2 font-mono">{source}</div>}
    </div>
  );
}
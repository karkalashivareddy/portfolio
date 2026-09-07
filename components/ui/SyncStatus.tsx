"use client";

import { timeAgo } from "../../lib/format";

const STYLES: Record<string, { color: string; label: string }> = {
  live: { color: "#34d399", label: "LIVE" },
  recent: { color: "#34d399", label: "RECENT" },
  synced: { color: "#9db6f0", label: "CACHED" },
  stale: { color: "#f5b759", label: "STALE" },
  unavailable: { color: "#f87171", label: "UNAVAILABLE" },
};

export default function SyncStatus({
  status,
  fetchedAt,
  label,
  className = "",
}: {
  status: string;
  fetchedAt: string | null | undefined;
  label?: string;
  className?: string;
}) {
  const s = STYLES[status] ?? STYLES.unavailable;
  return (
    <div
      className={`flex items-center gap-2 text-[11px] font-mono text-[#a9b0bb] ${className}`}
      title={fetchedAt ?? undefined}
    >
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }}
        aria-hidden
      />
      <span style={{ color: s.color }}>{s.label}</span>
      {label && <span>·</span>}
      {fetchedAt && <span>Synced {timeAgo(fetchedAt)}</span>}
      {status === "unavailable" && !fetchedAt && <span>offline snapshot</span>}
    </div>
  );
}
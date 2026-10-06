"use client";

import { useSyncExternalStore } from "react";
import { timeAgo, exactTimestamp } from "../../lib/format";
import type { Freshness } from "../../lib/types";

/**
 * Freshness presentation for a synchronized value.
 *
 * The vocabulary is the whole point of this component. A dot labelled "LIVE"
 * next to data that was actually read from disk an hour ago is worse than no
 * indicator at all, so each state is named for what is true:
 *
 *   live / recent  -> "Synchronized"  (read from the upstream API recently)
 *   synced         -> "Synchronized"  (outside the refresh window)
 *   stale          -> "Stale"         (older than 2x the TTL)
 *   very-stale     -> "Stale"         (over a week old)
 *   unavailable    -> "Not available" (no successful sync and no snapshot)
 *
 * A committed snapshot that is being shown because the API failed is reported
 * through `origin`, not through `status`, so "Verified snapshot" and "Stale
 * synchronized data" stay distinguishable.
 *
 * Relative time is rendered only after mount. During SSR and the first client
 * paint the component prints the absolute UTC timestamp, which both
 * environments compute identically; the relative label then replaces it. Doing
 * it the other way round — deriving "5 mins ago" on the server and again in the
 * browser — is a guaranteed mismatch whenever the two straddle a minute
 * boundary, and it was throwing React error #418 on the GitHub archive.
 */
const PRESENTATION: Record<Freshness, { color: string; label: string }> = {
  live: { color: "#34d399", label: "Synchronized" },
  recent: { color: "#34d399", label: "Synchronized" },
  synced: { color: "#9db6f0", label: "Synchronized" },
  stale: { color: "#f5b759", label: "Stale" },
  "very-stale": { color: "#f5b759", label: "Stale" },
  unavailable: { color: "#f87171", label: "Not available" },
};

/** The value this component needs is a single clock read after hydration. */
function subscribeNever(): () => void {
  return () => {};
}

export interface SyncStatusProps {
  status: Freshness | string;
  fetchedAt?: string | null;
  lastSuccessfulSync?: string | null;
  /** "api" = read from the upstream API, "snapshot" = committed fallback. */
  origin?: "api" | "snapshot" | null;
  /** Source name shown after the state, e.g. "Codolio". */
  label?: string;
  className?: string;
}

export default function SyncStatus({
  status,
  fetchedAt,
  lastSuccessfulSync,
  origin,
  label,
  className = "",
}: SyncStatusProps) {
  // `null` on the server and during hydration, the browser clock afterwards.
  // useSyncExternalStore is what guarantees that ordering without a setState in
  // an effect, and it keeps the relative label out of the server HTML entirely.
  const mountedAt = useSyncExternalStore(
    subscribeNever,
    () => Date.now(),
    () => null
  );

  const state = (status in PRESENTATION ? status : "unavailable") as Freshness;
  const p = PRESENTATION[state];

  const timestamp = fetchedAt ?? lastSuccessfulSync ?? null;
  const isSnapshot = origin === "snapshot";
  const relative = mountedAt === null ? null : timeAgo(timestamp, mountedAt);
  const exact = exactTimestamp(timestamp);

  // The sentence a screen reader announces, and the tooltip a mouse user gets.
  const spoken = [
    p.label,
    label ? `from ${label}` : null,
    isSnapshot ? "verified snapshot" : null,
    timestamp ? `last verified ${relative ?? exact}` : "no successful sync",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={`flex items-center gap-2 text-[11px] font-mono text-fg-2 ${className}`}
      title={exact ? `Last verified ${exact}` : undefined}
      data-sync-status={state}
      data-sync-origin={origin ?? "unknown"}
      data-synced-at={timestamp ?? undefined}
      data-relative-ready={mountedAt === null ? undefined : "true"}
    >
      <span
        className="inline-block w-2 h-2 rounded-full shrink-0"
        style={{ background: p.color, boxShadow: `0 0 8px ${p.color}` }}
        aria-hidden
      />
      <span style={{ color: p.color }}>{p.label}</span>
      {label && <span aria-hidden>&middot;</span>}
      {isSnapshot && (
        <>
          <span className="sr-only">verified snapshot,</span>
          <span aria-hidden>verified snapshot</span>
        </>
      )}
      <time dateTime={timestamp ?? undefined} aria-hidden>
        {timestamp ? (relative ?? exact) : "no data"}
      </time>
      <span className="sr-only">{spoken}</span>
    </div>
  );
}
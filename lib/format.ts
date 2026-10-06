export function formatNumber(n: number): string {
  if (n >= 1000) return n.toLocaleString("en-US");
  return String(n);
}

export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

/**
 * Relative time, computed from an absolute timestamp.
 *
 * This never takes a duration as input, so it cannot be handed a hard-coded
 * "2 hours ago" that stops being true.
 *
 * `now` is an explicit parameter so that the value can be pinned. The server
 * renders one instant and the browser hydrates at a slightly later one, and a
 * label computed independently at each point differs as soon as the request
 * crosses a minute boundary. That produced a hydration mismatch (React error
 * #418) on the GitHub archive, where `Date.now()` was called during SSR and
 * again during hydration. Components that render in both environments pass a
 * single `now` and only start showing relative time after mount.
 */
export function timeAgo(iso: string | null | undefined, now: number = Date.now()): string {
  if (!iso) return "never";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "unknown";
  const diff = now - t;
  if (diff < 0) return "just now";
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} day${d === 1 ? "" : "s"} ago`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w} week${w === 1 ? "" : "s"} ago`;
  const mo = Math.floor(d / 30);
  return `${mo} month${mo === 1 ? "" : "s"} ago`;
}

/**
 * Exact, unambiguous timestamp for tooltips and assistive labels.
 *
 * UTC by default, and the timezone is printed next to the value so the moment
 * is never ambiguous. The earlier version read the ambient system timezone,
 * which meant the server (UTC on most hosts) and the visitor's browser could
 * render two different clock times for the same instant — a hydration mismatch
 * on every page that shows a sync timestamp.
 */
export function exactTimestamp(iso: string | null | undefined, timeZone = "UTC"): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const zone = timeZone === "UTC" ? "UTC" : timeZone.replace(/_/g, " ");
  return `${d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  })} ${zone}`;
}

/** True when the value is old enough that presenting it without a date would mislead. */
export function needsDateCallout(
  iso: string | null | undefined,
  ttlMs: number,
  now: number = Date.now()
): boolean {
  if (!iso) return true;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return true;
  return now - t >= ttlMs;
}

export function freshLabel(status: string, iso: string | null | undefined, now?: number): string {
  if (status === "unavailable") return "Not currently available";
  return `Synced ${timeAgo(iso, now)}`;
}

/**
 * Calendar date only, pinned to UTC so the server and the browser agree.
 * A repository created late in the evening would otherwise show two different
 * days depending on who rendered it.
 */
export function friendlyDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return "—";
  return t.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
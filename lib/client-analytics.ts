"use client";

/**
 * Client-side analytics helper. Sends fire-and-forget events to the analytics
 * API (keepalive so navigation doesn't drop them). Visitor id is a random id
 * stored in localStorage — it carries no personal data.
 */

const ID_KEY = "pv_visitor_id";

export function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(ID_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(ID_KEY, id);
    return id;
  } catch {
    return "anon";
  }
}

function send(body: Record<string, unknown>) {
  try {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: getVisitorId(), ...body }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // analytics must never affect navigation
  }
}

export function trackPageview(path: string, referrer?: string) {
  send({ type: "pageview", path, referrer });
}

export function trackExternal(label: string, path?: string) {
  send({ type: "outbound", label, path });
}

/** Attach delegated clicks for [data-outbound] anchors. */
export function attachOutboundTracking() {
  const handler = (e: Event) => {
    const el = (e.target as HTMLElement).closest?.("[data-outbound]");
    if (el) trackExternal(String((el as HTMLElement).dataset.outbound || "link"));
  };
  document.addEventListener("click", handler);
  return () => document.removeEventListener("click", handler);
}
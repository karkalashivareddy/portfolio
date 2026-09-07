"use client";

import { useEffect, useRef, useState } from "react";

/** Live telemetry readout for the SIGNAL chapter: portfolio views + unique
 *  visitors streamed from the real analytics API with a count-up and a
 *  refresh timestamp. Never fabricates numbers — falls back to a clear
 *  unavailable state on error. */
export default function TelemetryReadout() {
  const [data, setData] = useState<{ views: number; uniqueVisitors: number; lastEventAt: string | null } | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [display, setDisplay] = useState<{ views: number; unique: number }>({ views: 0, unique: 0 });
  const [tick, setTick] = useState<string>("--:--:--");
  const started = useRef(false);

  useEffect(() => {
    let active = true;
    fetch("/api/analytics?scope=public")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad response"))))
      .then((json) => {
        if (!active) return;
        setData(json);
        setStatus("ok");
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, []);

  // Count-up + local clock tick
  useEffect(() => {
    if (status !== "ok" || !data || started.current) return;
    started.current = true;
    let raf = 0;
    const t0 = performance.now();
    const ease = 0.00015;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) * ease);
      const v = Math.round(data.views * (1 - Math.pow(1 - p, 3)));
      const u = Math.round(data.uniqueVisitors * (1 - Math.pow(1 - p, 3)));
      setDisplay({ views: v, unique: u });
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [status, data]);

  useEffect(() => {
    const clock = () => {
      const d = new Date();
      setTick(d.toLocaleTimeString("en-GB", { hour12: false }));
    };
    clock();
    const id = window.setInterval(clock, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (status === "loading") {
    return (
      <div className="inline-flex items-center gap-2 text-[13px] text-fg-2 font-mono" aria-busy="true">
        <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
        syncing signal…
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="inline-flex items-center gap-2 text-[13px] text-fg-2 font-mono">
        <span className="inline-block w-2 h-2 rounded-full bg-danger" />
        signal unavailable
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[13px] text-fg-1">
      <span className="inline-flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-ok" aria-hidden />
        <span className="tabular-nums text-fg-0">{display.views.toLocaleString("en-US")}</span> portfolio visits
      </span>
      <span className="hidden sm:inline text-fg-2">·</span>
      <span className="inline-flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent" aria-hidden />
        <span className="tabular-nums text-fg-0">{display.unique.toLocaleString("en-US")}</span> unique visitors
      </span>
      <span className="hidden md:inline text-fg-2">·</span>
      <span className="hidden md:inline tabular-nums text-fg-2">{tick} UTC{new Date().getTimezoneOffset() === 0 ? "" : "±0"}</span>
    </div>
  );
}
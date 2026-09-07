"use client";

import { useEffect, useState } from "react";
import StatBlock from "./StatBlock";
import SyncStatus from "./SyncStatus";

/** Real analytics-backed portfolio visit counter. Never fabricates counts. */
export default function ProfileViews({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<{
    views: number;
    uniqueVisitors: number;
    lastEventAt: string | null;
  } | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/analytics?scope=public")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad response"))))
      .then((json) => {
        if (!active) return;
        setData(json);
        setStatus("ok");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="inline-flex items-center gap-2 text-[13px] text-fg-2" aria-busy="true">
        <span className="inline-block w-3 h-3 rounded-full border border-electric animate-pulse" />
        loading visits…
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="inline-flex items-center gap-2 text-[13px] text-fg-2 font-mono">
        <span className="inline-block w-2 h-2 rounded-full bg-[#f87171]" />
        visits unavailable
      </div>
    );
  }

  if (compact) {
    return (
      <span className="inline-flex items-center gap-2 font-mono text-[12px] text-[#a9b0bb]">
        <span className="w-2 h-2 rounded-full bg-[#34d399]" />
        {data.views.toLocaleString("en-US")} portfolio visits
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-6">
        <StatBlock value={data.views} label="Portfolio visits" source="analytics" compact />
        <StatBlock value={data.uniqueVisitors} label="Unique visitors" source="analytics" compact />
      </div>
      <SyncStatus status="recent" fetchedAt={data.lastEventAt} label="Last event" />
    </div>
  );
}
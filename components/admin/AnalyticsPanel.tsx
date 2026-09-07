"use client";

import { useEffect, useState } from "react";
import type { AnalyticsSummary } from "../../lib/analytics";
import StatBlock from "../ui/StatBlock";
import SyncStatus from "../ui/SyncStatus";

function BarRow({ date, views, max }: { date: string; views: number; max: number }) {
  const h = max ? Math.max(4, Math.round((views / max) * 100)) : 4;
  return (
    <div className="flex flex-col items-center justify-end gap-1 h-[72px]" title={`${date} — ${views} views`}>
      <span className="text-[10px] text-fg-2 font-mono">{views}</span>
      <div className="w-full rounded-t bg-[#7aa2ff] opacity-80" style={{ height: `${h}%` }} />
      <span className="text-[10px] text-fg-2 font-mono">{date.slice(5)}</span>
    </div>
  );
}

function KV({ title, data, empty }: { title: string; data: [string, number][]; empty: string }) {
  return (
    <div className="card p-4">
      <h3 className="text-[13px] font-medium text-[#a9b0bb] uppercase tracking-wide mb-3">{title}</h3>
      {data.length === 0 && <p className="text-[13px] text-fg-2 font-mono">{empty}</p>}
      <ul className="flex flex-col gap-2">
        {data.map(([k, v]) => (
          <li key={k} className="flex items-center justify-between gap-3 text-[13px]">
            <span className="text-[#f2f4f7] truncate">{k}</span>
            <span className="text-[#7aa2ff] font-mono tabular-nums">{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AnalyticsPanel() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("unauthorized"))))
      .then(setSummary)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return <p className="text-[13px] text-[#f87171] font-mono">{error}</p>;
  if (!summary) return <p className="text-[13px] text-fg-2 font-mono">loading…</p>;

  const daily = summary.daily;
  const max = Math.max(1, ...daily.map((d) => d.views));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-[#f2f4f7]">Analytics</h1>
        <SyncStatus status="live" fetchedAt={summary.syncedAt} label="Aggregated" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBlock value={summary.totals.views} label="Total views" source="aggregate" compact />
        <StatBlock value={summary.totals.viewsToday} label="Views today" source="aggregate" compact />
        <StatBlock value={summary.totals.uniqueVisitors} label="Unique visitors" source="aggregate" compact />
        <StatBlock value={summary.totals.sessions} label="Sessions" source="estimated" compact />
      </div>

      <div className="card p-4">
        <h3 className="text-[13px] font-medium text-[#a9b0bb] uppercase tracking-wide mb-3">
          Daily views — last {daily.length} days
        </h3>
        {daily.length === 0 ? (
          <p className="text-[13px] text-fg-2 font-mono">no events tracked yet</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(28px,1fr))] gap-1 items-end">
            {daily.map((d) => (
              <BarRow key={d.date} date={d.date} views={d.views} max={max} />
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <KV title="Top paths" data={summary.topPaths.map((p) => [p.path, p.views])} empty="none" />
        <KV title="Outbound clicks" data={Object.entries(summary.outbound).sort((a, b) => b[1] - a[1])} empty="none" />
        <KV title="Device split" data={Object.entries(summary.devices).sort((a, b) => b[1] - a[1])} empty="none" />
        <KV title="Countries" data={Object.entries(summary.countries).sort((a, b) => b[1] - a[1])} empty="anonymized; none recorded yet" />
      </div>
    </div>
  );
}
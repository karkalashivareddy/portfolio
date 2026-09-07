"use client";

import { useEffect, useState } from "react";
import { RefreshCw, LogOut, FileText, BarChart3 } from "lucide-react";
import SyncStatus from "../ui/SyncStatus";

type Syncable = {
  source: string;
  label: string;
  status: string;
  fetchedAt: string | null;
  detail: string;
};

export default function AdminPanel() {
  const [syncables, setSyncables] = useState<Syncable[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = async () => {
    const [githubRes, codolioRes, settingsRes] = await Promise.all([
      fetch("/api/github"),
      fetch("/api/codolio"),
      fetch("/api/admin/settings"),
    ]);
    const gh = await githubRes.json();
    const co = await codolioRes.json();
    const settings = await settingsRes.json();
    setSyncables([
      {
        source: "github",
        label: "GitHub",
        status: gh.meta.status,
        fetchedAt: gh.meta.fetchedAt,
        detail: `${gh.profile.public_repos} public repos`,
      },
      {
        source: "codolio",
        label: "Codolio",
        status: co.meta.status,
        fetchedAt: co.meta.fetchedAt,
        detail: `${co.aggregate.totalSolved} problems · ${co.aggregate.platforms} platforms`,
      },
    ]);
    setNotice(
      `analytics ${settings.analytics.enabled ? "enabled" : "disabled"} · readme mode ${settings.readme.autoUpdate ? "auto" : "manual"}`
    );
  };

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [githubRes, codolioRes, settingsRes] = await Promise.all([
        fetch("/api/github"),
        fetch("/api/codolio"),
        fetch("/api/admin/settings"),
      ]);
      if (cancelled) return;
      const gh = await githubRes.json();
      const co = await codolioRes.json();
      const settings = await settingsRes.json();
      setSyncables([
        {
          source: "github",
          label: "GitHub",
          status: gh.meta.status,
          fetchedAt: gh.meta.fetchedAt,
          detail: `${gh.profile.public_repos} public repos`,
        },
        {
          source: "codolio",
          label: "Codolio",
          status: co.meta.status,
          fetchedAt: co.meta.fetchedAt,
          detail: `${co.aggregate.totalSolved} problems · ${co.aggregate.platforms} platforms`,
        },
      ]);
      setNotice(
        `analytics ${settings.analytics.enabled ? "enabled" : "disabled"} · readme mode ${settings.readme.autoUpdate ? "auto" : "manual"}`
      );
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const syncNow = async (source: string) => {
    setBusy(true);
    try {
      await fetch(`/api/sync/now?source=${source}`, { method: "POST" });
      await load();
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[#f2f4f7]">Dashboard</h1>
          <p className="text-[13px] text-fg-2 font-mono">{notice ?? "loading…"}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/admin/analytics"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#a9b0bb] border border-[rgba(255,255,255,0.12)] hover:text-white"
          >
            <BarChart3 className="w-4 h-4" /> Analytics
          </a>
          <a
            href="/admin/settings"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#a9b0bb] border border-[rgba(255,255,255,0.12)] hover:text-white"
          >
            <FileText className="w-4 h-4" /> README
          </a>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#a9b0bb] border border-[rgba(255,255,255,0.12)] hover:text-white"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {(syncables ?? []).map((s) => (
          <div key={s.source} className="card p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base text-[#f2f4f7]">{s.label}</h2>
              <SyncStatus status={s.status} fetchedAt={s.fetchedAt} />
            </div>
            <p className="text-[13px] text-[#a9b0bb] font-mono">{s.detail}</p>
            <button
              type="button"
              onClick={() => syncNow(s.source)}
              disabled={busy}
              className="self-start inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#f2f4f7] border border-[rgba(122,162,255,0.4)] hover:bg-[rgba(122,162,255,0.1)] disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${busy ? "animate-spin" : ""}`} /> Sync now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
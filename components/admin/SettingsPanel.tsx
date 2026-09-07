"use client";

import { useEffect, useState } from "react";
import { Copy, FileDown, RefreshCw } from "lucide-react";

type Settings = {
  github: { username: string; ttlMs: number };
  codolio: { userKey: string; ttlMs: number };
  analytics: { enabled: boolean };
  readme: { autoUpdate: boolean; approvalRequired: boolean };
  adminConfigured: boolean;
};

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [readme, setReadme] = useState<{ content?: string; mode?: string; approvalRequired?: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const [s, r] = await Promise.all([
        fetch("/api/admin/settings").then((r) => r.json()),
        fetch("/api/readme")
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ]);
      setSettings(s);
      setReadme(r);
    })();
  }, []);

  const regenerate = async () => {
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch("/api/readme", { method: "POST" });
      if (res.ok) {
        const j = await res.json();
        setReadme(j);
        setNotice("Regenerated (preview only). Requires your approval to save.");
      } else {
        setNotice("Regeneration failed");
      }
    } finally {
      setBusy(false);
    }
  };

  const publish = async () => {
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch("/api/readme/publish", { method: "POST" });
      const j = await res.json();
      setNotice(res.ok ? `Saved to ${j.writtenTo}` : `Failed: ${j.error ?? ""}`);
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    if (readme?.content) {
      await navigator.clipboard.writeText(readme.content);
      setNotice("Copied to clipboard");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl text-[#f2f4f7]">Settings</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {settings && (
          <>
            <div className="card p-4 flex flex-col gap-1 text-[13px]">
              <h3 className="text-[#a9b0bb] uppercase tracking-wide mb-1">GitHub</h3>
              <span className="font-mono">@{settings.github.username}</span>
              <span className="text-fg-2 font-mono">{Math.round(settings.github.ttlMs / 60000)} min TTL</span>
            </div>
            <div className="card p-4 flex flex-col gap-1 text-[13px]">
              <h3 className="text-[#a9b0bb] uppercase tracking-wide mb-1">Codolio</h3>
              <span className="font-mono">key {settings.codolio.userKey}</span>
              <span className="text-fg-2 font-mono">{Math.round(settings.codolio.ttlMs / 60000)} min TTL</span>
            </div>
            <div className="card p-4 flex flex-col gap-1 text-[13px]">
              <h3 className="text-[#a9b0bb] uppercase tracking-wide mb-1">General</h3>
              <span className="font-mono">analytics {settings.analytics.enabled ? "on" : "off"}</span>
              <span className="text-fg-2 font-mono">admin {settings.adminConfigured ? "configured" : "disabled"}</span>
            </div>
          </>
        )}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-display text-lg text-[#f2f4f7]">Profile README</h2>
            <p className="text-[13px] text-fg-2 font-mono">
              mode {readme?.mode ?? "…"} · approval required {readme?.approvalRequired ? "yes" : "no"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={regenerate}
              disabled={busy}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-[rgba(255,255,255,0.12)] text-[#f2f4f7] disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" /> Regenerate
            </button>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-[rgba(255,255,255,0.12)] text-[#f2f4f7]"
            >
              <Copy className="w-4 h-4" /> Copy
            </button>
            <button
              type="button"
              onClick={publish}
              disabled={busy}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-[#7aa2ff] text-[#0a0b0e] disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" /> Save draft
            </button>
          </div>
        </div>

        {notice && <p className="mt-3 text-[13px] text-[#7aa2ff] font-mono">{notice}</p>}

        <pre className="mt-4 p-4 rounded-lg text-[12px] leading-relaxed text-[#e7e9ed] overflow-auto max-h-[480px] code-frame">
          {readme?.content ?? "loading…"}
        </pre>
      </div>
    </div>
  );
}
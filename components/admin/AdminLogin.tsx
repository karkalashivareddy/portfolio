"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const j = await res.json().catch(() => null);
        setError(j?.error ?? "Login failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card max-w-sm mx-auto mt-12 p-6 flex flex-col gap-4">
      <div>
        <h1 className="font-display text-xl text-[#f2f4f7]">Admin sign in</h1>
        <p className="mt-1 text-[13px] text-fg-2 font-mono">set ADMIN_TOKEN to enable</p>
      </div>
      <input
        type="password"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Admin token"
        autoFocus
        required
        aria-label="Admin token"
        className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] rounded-lg px-3 py-2.5 text-[#f2f4f7] placeholder:text-fg-2 outline-none focus:border-[#7aa2ff] font-mono"
      />
      {error && <p className="text-[13px] text-[#f87171]">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="px-4 py-2.5 rounded-lg bg-[#7aa2ff] text-[#0a0b0e] text-sm font-medium disabled:opacity-50"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
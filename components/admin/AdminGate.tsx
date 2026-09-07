"use client";

import { useEffect, useState } from "react";
import AdminLogin from "./AdminLogin";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "unauth" | "auth">("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/gate")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad"))))
      .then((j) => {
        if (!active) return;
        setState(j.authed ? "auth" : "unauth");
      })
      .catch(() => {
        if (!active) return;
        setState("unauth");
      });
    return () => {
      active = false;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="mt-12 text-center text-[13px] text-fg-2 font-mono" aria-busy="true">
        checking session…
      </div>
    );
  }

  if (state === "unauth") return <AdminLogin />;
  return <>{children}</>;
}
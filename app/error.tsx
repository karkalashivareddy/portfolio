"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-5 sm:px-8">
      <div className="text-center max-w-[520px]">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-[12px] text-danger bg-danger/10 border border-danger/25 mb-8">
          <AlertTriangle className="w-4 h-4" aria-hidden />
          pad.g_v2_2@$fault
        </div>
        <h1 className="font-display text-5xl md:text-6xl text-fg-0 tracking-tight">
          Runtime fault
        </h1>
        <p className="mt-3 font-mono text-[14px] text-fg-2">
          PID: <span className="text-danger">ERR</span> · recovered at the boundary
        </p>
        <p className="mt-5 text-[14px] text-fg-1 leading-relaxed">
          Something in this build faulted while rendering. The error is contained —
          reload the page to retry, or return to a known-good section.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-[11px] text-fg-2">digest: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-ink text-[14px] font-medium hover:bg-accent-soft transition-colors"
          >
            <RotateCcw className="w-4 h-4" aria-hidden />
            Retry
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-line text-fg-0 text-[14px] hover:border-accent/50 hover:text-accent transition-colors"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
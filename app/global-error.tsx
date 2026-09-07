"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body className="antialiased bg-[#06070b] text-[#e7e9ee]">
        <div className="min-h-screen flex items-center justify-center px-5">
          <div className="text-center max-w-[520px]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-[12px] text-[#f87171] bg-[#f87171]/10 border border-[#f87171]/25 mb-8">
              pad.g_v2_2@$fatal
            </div>
            <h1 className="font-sans text-5xl md:text-6xl tracking-tight">
              Fatal fault
            </h1>
            <p className="mt-3 font-mono text-[14px] text-[#a9b0bb]">
              PID: <span className="text-[#f87171]">FATAL</span> · root boundary recovered
            </p>
            <p className="mt-5 text-[14px] text-[#c3c8d1] leading-relaxed">
              The application faulted below the root layout. A full reload is required.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7aa2ff] text-[#06070b] text-[14px] font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
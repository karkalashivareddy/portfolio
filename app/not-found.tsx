import Link from "next/link";
import { ArrowLeft, TerminalSquare } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-5 sm:px-8">
      <div className="text-center max-w-[520px]">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-[12px] text-warn bg-warn/10 border border-warn/25 mb-8">
          <TerminalSquare className="w-4 h-4" aria-hidden />
          pad.g_v2_2@$err
        </div>
        <h1 className="font-display text-6xl md:text-7xl text-fg-0 tracking-tight">
          404
        </h1>
        <p className="mt-3 font-mono text-[14px] text-fg-2">
          PROCESS NOT FOUND · PID: <span className="text-accent">404</span>
        </p>
        <p className="mt-5 text-[14px] text-fg-1 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist in this build — it was either
          removed, renamed, or never compiled.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            data-cursor="BACK HOME"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-ink text-[14px] font-medium hover:bg-accent-soft transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Back to the homepage
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-line text-fg-0 text-[14px] hover:border-accent/50 hover:text-accent transition-colors"
          >
            Browse projects
          </Link>
        </div>
      </div>
    </div>
  );
}
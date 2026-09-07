"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command as CommandIcon, Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/coding", label: "Coding" },
  { href: "/github", label: "GitHub" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const HOME_CHAPTERS = [
  { id: "origin", label: "01 / ORIGIN" },
  { id: "signal", label: "02 / SIGNAL" },
  { id: "work", label: "03 / WORK" },
  { id: "systems", label: "04 / SYSTEMS" },
  { id: "github", label: "05 / GITHUB" },
  { id: "about", label: "06 / ABOUT" },
  { id: "journey", label: "07 / JOURNEY" },
  { id: "learning", label: "08 / LEARNING" },
  { id: "contact", label: "09 / CONTACT" },
];

export default function Nav({ onOpenPalette }: { onOpenPalette: () => void }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [chapter, setChapter] = useState<string | null>(null);

  // Scroll handling: compact-on-scroll + home chapter scroll-spy.
  useEffect(() => {
    let raf = 0;
    const onHome = pathname === "/";
    const update = () => {
      setScrolled(window.scrollY > 24);
      if (!onHome) return;
      const y = window.scrollY + 128;
      let current: string | null = null;
      for (const c of HOME_CHAPTERS) {
        const el = document.getElementById(c.id);
        if (el && el.offsetTop <= y) current = c.label;
      }
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 24) {
        current = HOME_CHAPTERS[HOME_CHAPTERS.length - 1].label;
      }
      setChapter(current);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenPalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenPalette]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-0 pointer-events-none">
      <header
        aria-label="Primary"
        className={`world-nav pointer-events-auto relative w-full flex items-center justify-between px-5 sm:px-8 transition-all duration-500 ${
          scrolled
            ? "h-14 backdrop-blur-xl"
            : "h-16 backdrop-blur-md"
        }`}
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-electric/70 to-transparent"
        />
        <Link
          href="/"
          className="world-brand flex items-center gap-3 font-display font-semibold tracking-tight text-fg-0"
          aria-label="Home"
        >
          <span className="world-brand-mark relative flex items-center justify-center w-7 h-7 text-[11px] font-mono text-cyan border border-cyan/50">SR</span>
          <span className="hidden sm:inline text-[15px]">
            Shiva Reddy
            <span className="ml-2 text-[10px] font-mono text-fg-2 tracking-[0.14em] uppercase">
              B.Tech CS
            </span>
          </span>
        </Link>

        <nav className="world-nav-links hidden md:flex items-center gap-1" aria-label="Primary">
          {pathname === "/" && chapter && (
            <span className="mr-2 hidden xl:inline-block text-[10px] font-mono text-accent-soft tracking-[0.14em]" aria-hidden>
              {chapter}
            </span>
          )}
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`world-nav-link nav-link relative px-3 py-2 text-[13px] transition-colors ${
                isActive(l.href) ? "text-white" : "text-fg-1 hover:text-white"
              }`}
            >
              {isActive(l.href) && (
                <span className="nav-active" aria-hidden />
              )}
              <span className="relative">{l.label}</span>
            </Link>
          ))}
          <button
            type="button"
            onClick={onOpenPalette}
            data-cursor="COMMAND PALETTE"
            className="world-nav-search ml-2 flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-fg-2 border border-line hover:text-fg-0 hover:border-line-strong transition-colors font-mono"
          >
            <CommandIcon className="w-3.5 h-3.5" aria-hidden />
            <span className="hidden lg:inline">Search</span>
            <kbd className="hidden lg:inline text-[10px] bg-white/[0.06] px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </button>
        </nav>

        <button
          type="button"
          className="world-nav-menu md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-fg-0"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {open && (
        <div className="world-mobile-menu md:hidden pointer-events-auto absolute top-[calc(100%+8px)] left-4 right-4 rounded-2xl border border-line-strong bg-ink/90 backdrop-blur-xl px-4 pb-4 pt-3 flex flex-col gap-1 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.8)]">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm ${
                isActive(l.href) ? "text-white bg-white/[0.06]" : "text-fg-1"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onOpenPalette();
            }}
            className="px-3 py-2.5 rounded-lg text-sm text-fg-1 text-left"
          >
            ⌘K — Command palette
          </button>
        </div>
      )}
    </div>
  );
}

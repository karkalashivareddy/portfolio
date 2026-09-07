"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { projects } from "../../data/projects";
import { socials } from "../../data/profile";
import { copyEmailToClipboard } from "../ui/EmailCopyButton";

type Command = {
  id: string;
  label: string;
  hint?: string;
  action: () => void;
};

const HOME_SECTIONS = [
  { id: "signal", label: "Engineering signal" },
  { id: "work", label: "Selected work" },
  { id: "capabilities", label: "Systems & capabilities" },
  { id: "coding", label: "Coding proof" },
  { id: "github", label: "GitHub live data" },
  { id: "journey", label: "Journey" },
  { id: "learning", label: "Currently learning" },
  { id: "contact", label: "Contact" },
];

export default function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[14vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <PaletteContent onClose={onClose} />
      <button
        type="button"
        aria-label="Close palette"
        className="absolute inset-0 z-0 bg-black/40 cursor-default"
        onClick={onClose}
      />
    </div>
  );
}

/** Remounts on every open so query/selection always start fresh (no effect resets). */
function PaletteContent({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  const commands = useMemo<Command[]>(() => {
    const base: Command[] = [
      { id: "home", label: "Go home", action: () => router.push("/") },
      { id: "projects", label: "Projects", action: () => router.push("/projects") },
      { id: "coding", label: "Coding / CP", action: () => router.push("/coding") },
      { id: "github", label: "GitHub", action: () => router.push("/github") },
      { id: "about", label: "About me", action: () => router.push("/about") },
      { id: "contact", label: "Contact", action: () => router.push("/contact") },
    ];

    const external: Command[] = [
      {
        id: "gh-profile",
        label: "View GitHub profile",
        hint: "external",
        action: () => window.open(socials.github.url, "_blank", "noopener"),
      },
      {
        id: "codolio",
        label: "View Codolio profile",
        hint: "external",
        action: () => window.open(socials.codolio.url, "_blank", "noopener"),
      },
      {
        id: "linkedin",
        label: "Connect on LinkedIn",
        hint: "external",
        action: () => window.open(socials.linkedin.url, "_blank", "noopener"),
      },
    ];

    const sections: Command[] = HOME_SECTIONS.map((s) => ({
      id: `section-${s.id}`,
      label: `Go to section: ${s.label}`,
      hint: "home",
      action: () => {
        if (window.location.pathname === "/") {
          scrollTo(s.id);
        } else {
          router.push(`/#${s.id}`);
        }
      },
    }));

    const email: Command[] = [];
    if (socials.email) {
      email.push(
        {
          id: "copy-email",
          label: copiedEmail ? "Email copied ✓" : "Copy email address",
          hint: "clipboard",
          action: async () => {
            const ok = await copyEmailToClipboard();
            if (ok) setCopiedEmail(true);
          },
        },
        {
          id: "send-email",
          label: "Send email",
          hint: "mailto",
          action: () => {
            window.location.href = `mailto:${socials.email}`;
          },
        }
      );
    }

    const projectCommands: Command[] = projects.map((p) => ({
      id: `project-${p.slug}`,
      label: `Project: ${p.title}`,
      hint: p.type,
      action: () => router.push(`/projects/${p.slug}`),
    }));

    return [...base, ...sections, ...email, ...external, ...projectCommands];
  }, [router, copiedEmail]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || (c.hint ?? "").toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab") {
        const dialog = document.querySelector('[role="dialog"][aria-label="Command palette"]');
        if (!dialog) return;
        const focusables = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const current = document.activeElement;
        if (e.shiftKey) {
          if (current === first || !dialog.contains(current)) {
            e.preventDefault();
            last.focus();
          }
        } else if (current === last || !dialog.contains(current)) {
          e.preventDefault();
          first.focus();
        }
      }
      if (e.key === "ArrowDown") setActive((a) => Math.min(filtered.length - 1, a + 1));
      if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
      if (e.key === "Enter" && filtered[active]) {
        e.preventDefault();
        filtered[active].action();
        if (filtered[active].id !== "copy-email") onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered, active, onClose]);

  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <div
      className="relative z-10 w-full max-w-[560px] card overflow-hidden shadow-2xl"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="flex items-center gap-3 px-4 border-b border-[rgba(255,255,255,0.08)]">
        <Search className="w-4 h-4 text-fg-2" aria-hidden />
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          placeholder="Search projects, pages, actions…"
          className="flex-1 bg-transparent py-4 text-[15px] text-fg-0 placeholder:text-fg-2 outline-none"
          aria-label="Search commands"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-fg-2 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div ref={listRef} className="max-h-[46vh] overflow-y-auto p-2" role="listbox">
        {filtered.length === 0 && (
          <div className="px-3 py-8 text-center text-[13px] text-fg-2 font-mono">
            no commands match “{query}”
          </div>
        )}
        {filtered.map((c, i) => (
          <button
            key={c.id}
            type="button"
            role="option"
            aria-selected={i === active}
            onMouseEnter={() => setActive(i)}
            onClick={() => {
              c.action();
              if (c.id !== "copy-email") onClose();
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-[14px] transition-colors ${
              i === active
                ? "bg-accent/12 text-white"
                : "text-fg-1 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              {c.label}
              {c.hint && (
                <span className="text-[10px] font-mono text-fg-2 uppercase tracking-wide">
                  {c.hint}
                </span>
              )}
            </span>
            {i === active && <ArrowRight className="w-3.5 h-3.5 text-accent" aria-hidden />}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[rgba(255,255,255,0.08)] text-[11px] text-fg-2 font-mono">
        <span>↑↓ navigate</span>
        <span>↵ select</span>
        <span>esc close</span>
      </div>
    </div>
  );
}

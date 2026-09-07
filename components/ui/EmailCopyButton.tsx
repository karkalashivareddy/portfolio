"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { socials } from "../../data/profile";

export async function copyEmailToClipboard(): Promise<boolean> {
  const email = socials.email;
  if (!email) return false;
  try {
    await navigator.clipboard.writeText(email);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
}

type Props = {
  className?: string;
  children?: React.ReactNode;
  compact?: boolean;
  showMailto?: boolean;
  onStatusChange?: (copied: boolean) => void;
};

/** Copy-email button with instant COPIED ✓ feedback + optional mailto link.
 *  Announces via aria-live (polite). */
export default function EmailCopyButton({
  className = "",
  children,
  compact,
  showMailto = false,
  onStatusChange,
}: Props) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeout.current) window.clearTimeout(timeout.current);
    },
    []
  );

  const copy = async () => {
    const ok = await copyEmailToClipboard();
    if (!ok) return;
    setCopied(true);
    onStatusChange?.(true);
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => {
      setCopied(false);
      onStatusChange?.(false);
    }, 1800);
  };

  if (!socials.email) return null;

  return (
    <>
      <button
        type="button"
        onClick={copy}
        data-cursor="COPY EMAIL"
        data-magnetic="true"
        className={className}
        title={copied ? "Copied" : `Copy ${socials.email}`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" aria-hidden />
            COPIED ✓
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" aria-hidden />
            {children ?? (compact ? "email" : socials.email)}
          </>
        )}
      </button>
      {showMailto && (
        <a
          href={`mailto:${socials.email}`}
          data-cursor="SEND EMAIL"
          data-outbound="email"
          title={`Send email to ${socials.email}`}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.1)] text-[#a9b0bb] hover:text-white hover:border-[rgba(255,255,255,0.3)] transition-colors"
        >
          <Mail className="w-4 h-4" aria-hidden />
        </a>
      )}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </>
  );
}
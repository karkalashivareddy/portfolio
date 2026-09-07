"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import CommandPalette from "./CommandPalette";
import CursorFx from "../ui/CursorFx";
import WorldField from "./WorldField";
import { attachOutboundTracking, trackPageview } from "../../lib/client-analytics";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const paletteOpener = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  const openPalette = () => {
    paletteOpener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPaletteOpen(true);
  };

  const closePalette = () => {
    setPaletteOpen(false);
    window.requestAnimationFrame(() => paletteOpener.current?.focus());
  };

  useEffect(() => {
    trackPageview(pathname, document.referrer ? new URL(document.referrer).origin : undefined);
  }, [pathname]);

  useEffect(() => attachOutboundTracking(), []);

  return (
    <>
      <WorldField />
      <Nav onOpenPalette={openPalette} />
      <CommandPalette open={paletteOpen} onClose={closePalette} />
      <CursorFx />
      <div className="relative z-[1]">{children}</div>
    </>
  );
}

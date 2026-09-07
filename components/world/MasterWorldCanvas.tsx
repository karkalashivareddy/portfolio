"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; z: number; phase: number; size: number };
type Palette = { bg: string; a: string; b: string; c: string; d: string };

const palettes: Palette[] = [
  { bg: "#05060a", a: "#54e5ff", b: "#7c5cff", c: "#d946ef", d: "#f7f4ed" },
  { bg: "#06100d", a: "#32d583", b: "#b8ee4a", c: "#f5e642", d: "#f7f4ed" },
  { bg: "#120907", a: "#ff7448", b: "#ffb347", c: "#ed4d5f", d: "#fff3df" },
  { bg: "#f0eee8", a: "#2253ff", b: "#7657ff", c: "#e64caa", d: "#191a1c" },
  { bg: "#07060c", a: "#7c5cff", b: "#4edcff", c: "#ee4da9", d: "#fbf9f1" },
  { bg: "#0e0904", a: "#ffb02e", b: "#ff6b35", c: "#ff3e96", d: "#fff1d6" },
];

const nodes = [
  ["DSA", -0.95, -0.46, 0.2],
  ["SYSTEMS", -1.05, 0.16, -0.08],
  ["BACKEND", 1.02, -0.3, 0.14],
  ["DATABASE", -0.72, 0.73, -0.16],
  ["FULL STACK", 0.9, 0.62, 0.04],
  ["LINUX", 0.03, -0.96, -0.2],
] as const;

const platforms = ["CODECHEF", "LEETCODE", "GFG", "HACKERRANK", "CODEFORCES"];
const repoNames = ["pharmastock", "hospital-bed-dashboard", "DSA2-Projects", "FWD", "command-argument-passing"];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function mix(a: number, b: number, amount: number) {
  return a + (b - a) * amount;
}

function hexToRgb(hex: string) {
  if (hex.startsWith("rgb")) {
    const values = hex.match(/\d+/g)?.map(Number) ?? [0, 0, 0];
    return { r: values[0] ?? 0, g: values[1] ?? 0, b: values[2] ?? 0 };
  }
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function colour(a: string, b: string, amount: number) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return `rgb(${Math.round(mix(ca.r, cb.r, amount))}, ${Math.round(mix(ca.g, cb.g, amount))}, ${Math.round(mix(ca.b, cb.b, amount))})`;
}

function paletteAt(progress: number): Palette {
  const scaled = clamp(progress) * (palettes.length - 1);
  const index = Math.min(palettes.length - 2, Math.floor(scaled));
  const amount = scaled - index;
  const left = palettes[index];
  const right = palettes[index + 1];
  return {
    bg: colour(left.bg, right.bg, amount),
    a: colour(left.a, right.a, amount),
    b: colour(left.b, right.b, amount),
    c: colour(left.c, right.c, amount),
    d: colour(left.d, right.d, amount),
  };
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const x = clamp((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number) {
  const r = Math.min(radius, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export default function MasterWorldCanvas({ quiet = false }: { quiet?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;
    const ctx = context;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerFine = window.matchMedia("(pointer: fine)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const lowPower = (navigator.hardwareConcurrency || 4) <= 4 || Boolean(connection?.saveData);
    const points: Point[] = Array.from({ length: 180 }, (_, index) => ({
      x: ((index * 37) % 100) / 50 - 1,
      y: ((index * 61) % 100) / 50 - 1,
      z: ((index * 17) % 100) / 50 - 1,
      phase: (index * 0.71) % (Math.PI * 2),
      size: 0.6 + (index % 4) * 0.32,
    }));
    let width = 1;
    let height = 1;
    let dpr = 1;
    let scrollTarget = 0;
    let scrollProgress = 0;
    let scrollVelocity = 0;
    let lastScroll = window.scrollY;
    let lastTime = performance.now();
    let pointerX = 0;
    let pointerY = 0;
    let smoothPointerX = 0;
    let smoothPointerY = 0;
    let animationFrame = 0;
    let stopped = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 || lowPower ? 1.15 : 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const updateScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollTarget = quiet ? 0.05 : clamp(window.scrollY / max);
    };

    const move = (event: MouseEvent) => {
      pointerX = event.clientX / Math.max(1, window.innerWidth) - 0.5;
      pointerY = event.clientY / Math.max(1, window.innerHeight) - 0.5;
    };

    const drawDot = (x: number, y: number, radius: number, fill: string, alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const project = (x: number, y: number, z: number, time: number) => {
      const yaw = smoothPointerX * 0.18 + (scrollProgress - 0.5) * 0.08;
      const pitch = smoothPointerY * 0.12;
      const rotatedX = x * Math.cos(yaw) - z * Math.sin(yaw);
      const rotatedZ = x * Math.sin(yaw) + z * Math.cos(yaw);
      const elevatedY = y * Math.cos(pitch) - rotatedZ * Math.sin(pitch);
      const depth = 1.15 / (1.9 - (rotatedZ + Math.sin(time * 0.00025) * 0.08));
      return {
        x: width * 0.58 + rotatedX * Math.min(width, height) * 0.43 * depth,
        y: height * 0.51 + elevatedY * Math.min(width, height) * 0.43 * depth,
        scale: depth,
      };
    };

    const drawRings = (time: number, palette: Palette, opacity: number) => {
      ctx.save();
      ctx.translate(width * 0.58, height * 0.51);
      ctx.rotate(-0.12 + smoothPointerX * 0.24);
      ctx.globalAlpha = opacity;
      [0.34, 0.5, 0.68].forEach((radius, index) => {
        ctx.strokeStyle = index === 1 ? palette.a : palette.b;
        ctx.lineWidth = index === 1 ? 1.2 : 0.7;
        ctx.setLineDash(index === 1 ? [] : [4, 9]);
        ctx.beginPath();
        ctx.ellipse(0, 0, Math.min(width, height) * radius, Math.min(width, height) * radius * (0.28 + index * 0.08), time * 0.00012 * (index % 2 ? -1 : 1), 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      ctx.restore();
    };

    const drawCore = (time: number, palette: Palette) => {
      const coreProgress = (1 - smoothstep(0.18, 0.36, scrollProgress)) * (1 - smoothstep(0.82, 0.98, scrollProgress));
      const reveal = coreProgress;
      if (reveal < 0.02) return;
      drawRings(time, palette, 0.45 * reveal);
      const center = project(0, 0, 0, time);
      const radius = Math.min(width, height) * 0.085 * center.scale;
      const glow = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius * 3.2);
      glow.addColorStop(0, palette.a);
      glow.addColorStop(0.22, palette.a.replace("rgb", "rgba").replace(")", ", 0.28)"));
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = reveal;
      ctx.fillStyle = glow;
      ctx.fillRect(center.x - radius * 3.2, center.y - radius * 3.2, radius * 6.4, radius * 6.4);
      ctx.strokeStyle = palette.d;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = palette.bg;
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius * 0.52, 0, Math.PI * 2);
      ctx.fill();
      drawDot(center.x, center.y, radius * 0.19, palette.a, 0.95);

      nodes.forEach(([label, x, y, z], index) => {
        const drift = Math.sin(time * 0.0007 + index) * 0.025;
        const point = project(x + drift, y, z, time);
        const distanceX = point.x - center.x;
        const distanceY = point.y - center.y;
        ctx.globalAlpha = reveal * 0.48;
        ctx.strokeStyle = index % 2 ? palette.b : palette.a;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        drawDot(point.x, point.y, 3.5 * point.scale, index % 2 ? palette.c : palette.a, reveal);
        ctx.globalAlpha = reveal * 0.85;
        ctx.font = `${Math.max(8, 9 * point.scale)}px ui-monospace, monospace`;
        ctx.fillStyle = palette.d;
        ctx.fillText(label, point.x + distanceX * 0.08, point.y + distanceY * 0.08);
      });
    };

    const drawSignal = (time: number, palette: Palette) => {
      const signal = smoothstep(0.16, 0.42, scrollProgress) * (1 - smoothstep(0.4, 0.61, scrollProgress));
      if (signal < 0.02) return;
      ctx.save();
      ctx.globalAlpha = signal * 0.8;
      for (let stream = 0; stream < platforms.length; stream += 1) {
        ctx.strokeStyle = stream % 2 ? palette.b : palette.a;
        ctx.lineWidth = stream === 0 ? 1.4 : 0.7;
        ctx.beginPath();
        ctx.moveTo(width * 0.08, height * (0.24 + stream * 0.11));
        ctx.bezierCurveTo(width * 0.28, height * (0.1 + stream * 0.15), width * 0.52, height * (0.55 - stream * 0.1), width * 0.93, height * (0.22 + stream * 0.12));
        ctx.stroke();
        const p = (time * 0.00008 * (1 + stream * 0.05) + stream * 0.16) % 1;
        const x = width * (0.08 + p * 0.85);
        const py = height * (0.24 + stream * 0.11) + Math.sin(p * Math.PI * 2) * height * (0.1 + stream * 0.015);
        drawDot(x, py, 2.5 + stream * 0.3, stream % 2 ? palette.c : palette.a, 0.95);
        ctx.font = "9px ui-monospace, monospace";
        ctx.fillStyle = palette.d;
        ctx.fillText(platforms[stream], width * 0.08, height * (0.21 + stream * 0.11));
      }
      ctx.restore();
    };

    const drawArchitecture = (time: number, palette: Palette) => {
      const architecture = smoothstep(0.32, 0.58, scrollProgress) * (1 - smoothstep(0.58, 0.74, scrollProgress));
      if (architecture < 0.02) return;
      const items = ["REACT", "REST API", "EXPRESS", "MONGOOSE", "MONGODB", "ANALYTICS"];
      const startX = width * 0.18;
      const startY = height * 0.2;
      ctx.save();
      ctx.globalAlpha = architecture;
      items.forEach((item, index) => {
        const x = startX + (index % 3) * width * 0.22;
        const y = startY + Math.floor(index / 3) * height * 0.38;
        const drift = Math.sin(time * 0.0005 + index) * 5;
        roundedRect(ctx, x, y + drift, width * 0.16, height * 0.11, 8);
        ctx.strokeStyle = index < 3 ? palette.a : palette.c;
        ctx.lineWidth = index === 4 ? 1.5 : 0.8;
        ctx.stroke();
        ctx.font = "10px ui-monospace, monospace";
        ctx.fillStyle = palette.d;
        ctx.fillText(item, x + 12, y + drift + height * 0.065);
        if (index < items.length - 1) {
          ctx.strokeStyle = palette.b;
          ctx.beginPath();
          ctx.moveTo(x + width * 0.16, y + drift + height * 0.055);
          ctx.lineTo(x + width * 0.205, y + drift + height * 0.055);
          ctx.stroke();
        }
      });
      ctx.restore();
    };

    const drawMap = (time: number, palette: Palette) => {
      const map = smoothstep(0.54, 0.74, scrollProgress) * (1 - smoothstep(0.74, 0.87, scrollProgress));
      if (map < 0.02) return;
      const mapNodes = [
        [0.23, 0.28, "JAVA"], [0.44, 0.42, "DSA"], [0.66, 0.26, "BACKEND"],
        [0.78, 0.58, "DATABASE"], [0.48, 0.72, "SYSTEMS"], [0.2, 0.72, "LINUX"],
      ] as const;
      ctx.save();
      ctx.globalAlpha = map;
      ctx.lineWidth = 0.8;
      mapNodes.forEach(([nx, ny], index) => {
        const next = mapNodes[(index + 1) % mapNodes.length];
        ctx.strokeStyle = index % 2 ? palette.b : palette.a;
        ctx.beginPath();
        ctx.moveTo(width * nx, height * ny);
        ctx.quadraticCurveTo(width * 0.55, height * (0.48 + Math.sin(time * 0.0003 + index) * 0.04), width * next[0], height * next[1]);
        ctx.stroke();
      });
      mapNodes.forEach(([nx, ny, label], index) => {
        const x = width * nx;
        const y = height * ny;
        drawDot(x, y, index === 1 ? 7 : 4, index % 2 ? palette.c : palette.a, 0.95);
        ctx.font = "10px ui-monospace, monospace";
        ctx.fillStyle = palette.d;
        ctx.fillText(label, x + 12, y + 4);
      });
      ctx.restore();
    };

    const drawConstellation = (time: number, palette: Palette) => {
      const constellation = smoothstep(0.7, 0.9, scrollProgress) * (1 - smoothstep(0.86, 0.98, scrollProgress));
      if (constellation < 0.02) return;
      ctx.save();
      ctx.globalAlpha = constellation;
      const positions = repoNames.map((_, index) => ({
        x: width * (0.22 + index * 0.16),
        y: height * (0.28 + (index % 2) * 0.27) + Math.sin(time * 0.0004 + index) * 8,
      }));
      positions.forEach((position, index) => {
        if (index < positions.length - 1) {
          ctx.strokeStyle = palette.b;
          ctx.beginPath();
          ctx.moveTo(position.x, position.y);
          ctx.lineTo(positions[index + 1].x, positions[index + 1].y);
          ctx.stroke();
        }
        drawDot(position.x, position.y, 5 + index, index % 2 ? palette.c : palette.a, 0.95);
        ctx.font = "9px ui-monospace, monospace";
        ctx.fillStyle = palette.d;
        ctx.fillText(repoNames[index], position.x + 12, position.y + 3);
      });
      ctx.restore();
    };

    const drawContact = (time: number, palette: Palette) => {
      const contact = smoothstep(0.86, 1, scrollProgress);
      if (contact < 0.02) return;
      const cx = width * 0.58;
      const cy = height * 0.5;
      ctx.save();
      ctx.globalAlpha = contact;
      for (let index = 0; index < 34; index += 1) {
        const angle = (index / 34) * Math.PI * 2 + time * 0.00005;
        const distance = mix(Math.min(width, height) * 0.4, 2, contact) * (0.55 + (index % 5) * 0.08);
        drawDot(cx + Math.cos(angle) * distance, cy + Math.sin(angle) * distance, 1.2 + (index % 3), index % 2 ? palette.c : palette.a, 0.8);
      }
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.25);
      glow.addColorStop(0, palette.c);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - width * 0.28, cy - height * 0.3, width * 0.56, height * 0.6);
      ctx.restore();
    };

    const frame = (time: number) => {
      const delta = Math.min(80, time - lastTime);
      lastTime = time;
      const scrollDelta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      scrollVelocity = mix(scrollVelocity, scrollDelta / Math.max(1, delta), 0.16);
      scrollProgress = mix(scrollProgress, scrollTarget, reduced.matches ? 1 : 0.08);
      smoothPointerX = mix(smoothPointerX, pointerX, reduced.matches || !pointerFine.matches ? 0.02 : 0.09);
      smoothPointerY = mix(smoothPointerY, pointerY, reduced.matches || !pointerFine.matches ? 0.02 : 0.09);
      const palette = paletteAt(scrollProgress);
      const motionTime = reduced.matches ? 0 : time;
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, width, height);

      const ambient = ctx.createRadialGradient(width * (0.62 + smoothPointerX * 0.16), height * (0.2 + smoothPointerY * 0.12), 0, width * 0.58, height * 0.48, Math.max(width, height) * 0.78);
      ambient.addColorStop(0, colour(palette.a, palette.c, 0.5).replace("rgb", "rgba").replace(")", ", 0.16)"));
      ambient.addColorStop(0.42, colour(palette.b, palette.c, 0.5).replace("rgb", "rgba").replace(")", ", 0.06)"));
      ambient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";
      const particleCount = reduced.matches
        ? 0
        : width < 700
          ? quiet || lowPower ? 34 : 56
          : quiet || lowPower ? 96 : points.length;
      points.slice(0, particleCount).forEach((point, index) => {
        const phase = reduced.matches ? point.phase : point.phase + time * 0.00016 + scrollVelocity * 0.8;
        const x = point.x + Math.sin(phase) * 0.025;
        const y = point.y + Math.cos(phase * 0.8) * 0.025;
        const projected = project(x, y, point.z, time);
        drawDot(projected.x, projected.y, point.size * projected.scale, index % 5 === 0 ? palette.c : palette.a, 0.24 + projected.scale * 0.2);
      });
      ctx.globalCompositeOperation = "source-over";
      drawCore(motionTime, palette);
      drawSignal(motionTime, palette);
      drawArchitecture(motionTime, palette);
      drawMap(motionTime, palette);
      drawConstellation(motionTime, palette);
      drawContact(motionTime, palette);
      const worldReadoutAlpha = 1 - smoothstep(0.84, 0.96, scrollProgress);
      if (worldReadoutAlpha > 0.01) {
        ctx.globalAlpha = worldReadoutAlpha;
        ctx.fillStyle = colour(palette.d, palette.bg, 0.85);
        ctx.font = "10px ui-monospace, monospace";
        ctx.fillText(`WORLD / ${(scrollProgress * 100).toFixed(0).padStart(3, "0")}% / v${Math.abs(scrollVelocity).toFixed(2)}`, 24, height - 26);
      }
      ctx.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(frame);
    };

    resize();
    updateScroll();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    if (pointerFine.matches) window.addEventListener("mousemove", move, { passive: true });
    animationFrame = window.requestAnimationFrame(frame);
    const visibility = () => {
      if (document.hidden) {
        stopped = true;
        window.cancelAnimationFrame(animationFrame);
      } else if (stopped) {
        stopped = false;
        lastTime = performance.now();
        animationFrame = window.requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [quiet]);

  return <canvas ref={canvasRef} className="x2-world-canvas" aria-hidden="true" />;
}

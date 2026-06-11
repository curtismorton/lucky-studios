"use client";

import { useEffect, useState } from "react";

function format(frames: number): string {
  const f = frames % 25;
  const totalSeconds = Math.floor(frames / 25);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600) % 24;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
}

/** Running PAL timecode, the heartbeat in the corner of the frame. */
export default function Timecode({ className = "" }: { className?: string }) {
  const [frames, setFrames] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const interval = window.setInterval(() => {
      setFrames((value) => value + 1);
    }, 1000 / 25);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <span
      className={`tc-label tabular-nums text-bone/50 ${className}`}
      aria-hidden
    >
      TC {format(frames)}
    </span>
  );
}

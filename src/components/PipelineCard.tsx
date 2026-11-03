"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { pipeline } from "@/content";
import { prefersReducedMotion } from "@/lib/motion";
import { Icon } from "./ui";

// Coordenadas en un lienzo de 560 × 250; los textos escalan con unidades cqw.
const NODES = [
  { x: 0, y: 103, w: 132 },
  { x: 188, y: 30, w: 146 },
  { x: 188, y: 172, w: 146 },
  { x: 402, y: 102, w: 158 },
];
const EDGES = [
  "M132 125 C 162 125 158 53 188 53",
  "M132 125 C 162 125 158 195 188 195",
  "M334 53 C 370 53 366 125 402 125",
  "M334 195 C 370 195 366 125 402 125",
];
const SEQUENCE = [0, 1, 3, 0, 2, 3];
const SEED_TIMES = ["09:43:02", "09:41:48", "09:41:02"];

type Row = { id: number; time: string; name: string; ms: number };

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const clock = () => new Date().toLocaleTimeString("es-MX", { hour12: false });

export default function PipelineCard() {
  const tiltRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [rows, setRows] = useState<Row[]>(() =>
    pipeline.logs.slice(0, 3).map((l, i) => ({ id: i, time: SEED_TIMES[i], ...l })),
  );

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let n = 3;
    const a = setInterval(() => setStep((s) => (s + 1) % SEQUENCE.length), 1500);
    const b = setInterval(() => {
      const l = pipeline.logs[n % pipeline.logs.length];
      const row = { id: n++, time: clock(), name: l.name, ms: Math.round(80 + Math.random() * 320) };
      setRows((r) => [row, ...r].slice(0, 3));
    }, 2800);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  // Inclinación 3D que sigue al cursor (solo escritorio)
  useEffect(() => {
    const el = tiltRef.current!;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set(el, { transformPerspective: 1600, rotationY: -13, rotationX: 5 });
      const ry = gsap.quickTo(el, "rotationY", { duration: 1.2, ease: "power3.out" });
      const rx = gsap.quickTo(el, "rotationX", { duration: 1.2, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        ry(-13 + x * 8);
        rx(5 - y * 6);
      };
      window.addEventListener("pointermove", move, { passive: true });
      return () => window.removeEventListener("pointermove", move);
    });
    return () => mm.revert();
  }, []);

  const active = SEQUENCE[step];
  const prev = SEQUENCE[(step + SEQUENCE.length - 1) % SEQUENCE.length];
  const liveEdge = EDGES.findIndex((_, i) => {
    const pairs = [[0, 1], [0, 2], [1, 3], [2, 3]];
    return pairs[i][0] === prev && pairs[i][1] === active;
  });

  return (
    <div
      ref={tiltRef}
      aria-hidden
      className="glass overflow-hidden rounded-[20px] lg:[transform:perspective(1600px)_rotateY(-13deg)_rotateX(5deg)]"
    >
      <div className="flex items-center justify-between border-b border-white/6 px-5 py-3.5">
        <div className="mono flex items-center gap-3 text-muted">
          <span className="whitespace-nowrap text-ink/85">{pipeline.title}</span>
          <span className="hidden h-3 w-px bg-white/10 sm:block" />
          <span className="hidden whitespace-nowrap sm:inline">{pipeline.meta}</span>
        </div>
        <span className="mono flex items-center gap-2 whitespace-nowrap text-lime">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-lime shadow-[0_0_8px_var(--color-lime)]" />
          en vivo
        </span>
      </div>

      <div className="flex gap-3 px-3 py-4 sm:px-4">
        <div className="flex flex-col gap-1.5 pt-1">
          {[Icon.Cursor, Icon.Plus, Icon.Branch].map((I, i) => (
            <span
              key={i}
              className={`grid size-7 place-items-center rounded-md border border-white/8 text-muted ${i === 0 ? "bg-white/8 text-ink" : "bg-white/[0.03]"}`}
            >
              <I width={13} height={13} />
            </span>
          ))}
        </div>

        <div className="relative flex-1 @container">
          <span className="mono absolute right-0 top-0 rounded-md border border-white/8 bg-white/[0.03] px-2 py-1 text-[10px] text-muted">
            100%
          </span>
          <div className="relative aspect-[560/250] w-full">
            <svg viewBox="0 0 560 250" className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
              {EDGES.map((d, i) => (
                <g key={d}>
                  <path d={d} stroke="rgb(255 255 255 / 0.14)" strokeWidth="1.2" fill="none" />
                  <path
                    d={d}
                    pathLength={100}
                    className="flow"
                    stroke="var(--color-lime)"
                    strokeWidth="1.6"
                    fill="none"
                    style={{ animationDelay: `${i * -0.65}s`, opacity: liveEdge === i ? 1 : 0.45 }}
                  />
                </g>
              ))}
            </svg>

            {[
              { label: "sí", x: 136, y: 70 },
              { label: "no", x: 136, y: 162 },
            ].map((c) => (
              <span
                key={c.label}
                className="mono absolute rounded border border-white/8 bg-[#111410] px-[1.2cqw] py-[0.4cqw] text-[1.75cqw] leading-none text-muted"
                style={{ left: pct(c.x, 560), top: pct(c.y, 250) }}
              >
                {c.label}
              </span>
            ))}

            {pipeline.nodes.map((node, i) => {
              const pos = NODES[i];
              return (
                <div
                  key={node.id}
                  data-active={active === i}
                  className="chip absolute flex flex-col justify-center px-[2.2cqw] py-[1.5cqw]"
                  style={{ left: pct(pos.x, 560), top: pct(pos.y, 250), width: pct(pos.w, 560) }}
                >
                  <span className="text-[max(9px,2.3cqw)] font-medium leading-tight text-ink">{node.title}</span>
                  <span className="mono mt-[0.5cqw] text-[max(8px,1.8cqw)] leading-none text-faint">{node.sub}</span>
                  <span className="absolute -left-[3px] top-1/2 size-[6px] -translate-y-1/2 rounded-full border border-white/30 bg-bg" />
                  <span className="absolute -right-[3px] top-1/2 size-[6px] -translate-y-1/2 rounded-full border border-white/30 bg-bg" />
                </div>
              );
            })}

            <span
              className="mono absolute flex items-center gap-[0.8cqw] text-[1.8cqw] text-muted"
              style={{ left: pct(406, 560), top: pct(162, 250) }}
            >
              <Icon.Clock width="1em" height="1em" /> 26 min
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/6 px-5 pb-4 pt-3">
        <p className="mono mb-2 text-[11px] text-faint">últimos deploys</p>
        <ul className="mono space-y-1.5 text-[11.5px]">
          {rows.map((r) => (
            <li key={r.id} className="row-in flex items-center gap-3 text-muted">
              <span className="size-1.5 rounded-full bg-lime" />
              <span className="tabular-nums text-faint">{r.time}</span>
              <span className="truncate text-ink/80">{r.name}</span>
              <span className="ml-auto tabular-nums text-faint">{r.ms} ms</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const SCORES = [
  { label: "Rendimiento", value: 98 },
  { label: "Accesibilidad", value: 100 },
  { label: "Buenas prácticas", value: 100 },
  { label: "SEO", value: 100 },
];
const R = 26;
const C = 2 * Math.PI * R;

export function LighthouseRings() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const rings = el.querySelectorAll<SVGCircleElement>("[data-ring]");
    const nums = el.querySelectorAll<HTMLElement>("[data-ring-num]");
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set(rings, { strokeDashoffset: C });
      nums.forEach((n) => (n.textContent = "0"));
      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        once: true,
        onEnter: () => {
          rings.forEach((ring, i) => {
            const v = SCORES[i].value;
            const o = { n: 0 };
            gsap.to(ring, { strokeDashoffset: C * (1 - v / 100), duration: 1.8, ease: "expo.out", delay: i * 0.12 });
            gsap.to(o, {
              n: v,
              duration: 1.8,
              ease: "expo.out",
              delay: i * 0.12,
              onUpdate: () => (nums[i].textContent = String(Math.round(o.n))),
            });
          });
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} aria-hidden className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
      {SCORES.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-3 text-center">
          <div className="relative size-[72px]">
            <svg viewBox="0 0 64 64" className="size-full -rotate-90">
              <circle cx="32" cy="32" r={R} fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth="4" />
              <circle
                data-ring
                cx="32"
                cy="32"
                r={R}
                fill="none"
                stroke="var(--color-lime)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - s.value / 100)}
                className="drop-shadow-[0_0_6px_rgb(200_240_60/0.6)]"
              />
            </svg>
            <span data-ring-num className="absolute inset-0 grid place-items-center font-mono text-[17px] tabular-nums text-ink">
              {s.value}
            </span>
          </div>
          <span className="mono text-[11px] text-muted">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

const WIDTHS = [
  { w: "30%", label: "375 px · móvil" },
  { w: "58%", label: "768 px · tablet" },
  { w: "100%", label: "1440 px · escritorio" },
];

export function DeviceMorph() {
  const frameRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline({ repeat: -1 });
    [...WIDTHS, WIDTHS[1]].forEach((s) => {
      tl.to(frameRef.current, { width: s.w, duration: 1.1, ease: "expo.inOut" })
        .call(() => {
          if (labelRef.current) labelRef.current.textContent = s.label;
        })
        .to({}, { duration: 1.3 });
    });
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div aria-hidden className="flex h-full flex-col">
      <div className="relative flex flex-1 items-end justify-center">
        <div ref={frameRef} className="h-[120px] w-[58%] rounded-[10px] border border-white/12 bg-white/[0.03] p-2">
          <div className="flex h-full flex-col gap-1.5 overflow-hidden rounded-[6px] bg-bg/70 p-2">
            <div className="flex items-center justify-between">
              <span className="h-1.5 w-8 rounded-full bg-lime/80" />
              <span className="h-1.5 w-5 rounded-full bg-white/15" />
            </div>
            <span className="mt-2 h-2 w-3/4 rounded-full bg-white/25" />
            <span className="h-2 w-1/2 rounded-full bg-white/15" />
            <div className="mt-auto flex gap-1.5">
              <span className="h-6 flex-1 rounded bg-white/[0.06]" />
              <span className="h-6 flex-1 rounded bg-white/[0.06]" />
              <span className="h-6 flex-1 rounded bg-lime/25" />
            </div>
          </div>
        </div>
      </div>
      <span ref={labelRef} className="mono mt-4 text-center text-[11px] text-muted">
        {WIDTHS[1].label}
      </span>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brief, site } from "@/content";
import { prefersReducedMotion } from "@/lib/motion";
import { Icon, Logo } from "./ui";

gsap.registerPlugin(ScrollTrigger);

/** Ejecuta `play` la primera vez que el elemento entra en pantalla. */
function useOnEnter(ref: React.RefObject<HTMLElement | null>, play: (el: HTMLElement) => gsap.core.Timeline | void) {
  useEffect(() => {
    const el = ref.current!;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: el, start: "top 72%", once: true, onEnter: () => play(el) });
    });
    return () => ctx.revert();
  }, []);
}

export function BriefCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(-1);

  useOnEnter(ref, () => {
    if (prefersReducedMotion()) return setDone(brief.length);
    const tl = gsap.timeline();
    brief.forEach((_, i) => tl.call(() => setDone(i), [], 0.35 + i * 0.55));
    tl.call(() => setDone(brief.length), [], 0.35 + brief.length * 0.55);
    return tl;
  });

  return (
    <div ref={ref} aria-hidden className="glass spot overflow-hidden">
      <div className="mono flex items-center justify-between border-b border-white/6 px-5 py-3.5 text-muted">
        <span className="text-ink/85">brief.md</span>
        <span>1 página</span>
      </div>
      <ul className="space-y-1 p-3">
        {brief.map((item, i) => {
          const checked = done >= i;
          return (
            <li
              key={item}
              className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14px] transition-colors duration-500 ${checked ? "bg-white/[0.035] text-ink" : "text-faint"}`}
            >
              <span
                className={`grid size-[18px] place-items-center rounded-[5px] border transition-all duration-500 ${checked ? "border-lime bg-lime text-lime-ink shadow-[0_0_14px_-2px_var(--color-lime)]" : "border-white/15"}`}
              >
                {checked && <Icon.Check width={12} height={12} strokeWidth={2.2} />}
              </span>
              {item}
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-between border-t border-white/6 px-5 py-3.5">
        <span className="mono text-faint">30 min de llamada</span>
        <span
          className={`mono rounded-md px-2 py-1 text-[11px] transition-all duration-700 ${done >= brief.length ? "bg-lime text-lime-ink" : "bg-white/5 text-faint"}`}
        >
          {done >= brief.length ? "listo para empezar" : "en revisión"}
        </span>
      </div>
    </div>
  );
}

export function ChatCard() {
  const ref = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const [approved, setApproved] = useState(false);

  useOnEnter(ref, (card) => {
    if (prefersReducedMotion()) return setApproved(true);
    const c = cursorRef.current!;
    const cr = card.getBoundingClientRect();
    const br = btnRef.current!.getBoundingClientRect();
    const tl = gsap.timeline({ delay: 0.5 });
    tl.set(c, { x: cr.width * 0.85, y: cr.height * 1.05, opacity: 0 })
      .to(c, { opacity: 1, duration: 0.3 })
      .to(c, { x: br.left - cr.left + br.width * 0.55, y: br.top - cr.top + br.height * 0.6, duration: 1.1, ease: "power3.inOut" })
      .to(c, { scale: 0.82, duration: 0.12, yoyo: true, repeat: 1 })
      .call(() => setApproved(true))
      .to(c, { opacity: 0, duration: 0.4, delay: 0.5 });
    return tl;
  });

  return (
    <div ref={ref} aria-hidden className="glass spot relative overflow-hidden">
      <div className="mono flex items-center justify-between border-b border-white/6 px-5 py-3.5 text-muted">
        <span className="text-ink/85">#tu-proyecto</span>
        <span>hoy</span>
      </div>
      <div className="p-5">
        <div className="flex gap-3">
          <Logo size={30} />
          <div className="min-w-0 flex-1">
            <p className="flex items-baseline gap-2 text-[14px]">
              <span className="font-medium">{site.firstName}</span>
              <span className="mono text-[11px] text-faint">9:41</span>
            </p>
            <p className="mt-1 text-[14px] leading-relaxed text-ink/85">
              La página de inicio está lista para revisar. ¿La publico?
            </p>
            <dl className="mono mt-3 space-y-1.5 border-l-2 border-lime/70 pl-3 text-[12px]">
              {[
                ["preview", "inicio-v3.vercel.app"],
                ["cambios", "hero, menú, reservas"],
                ["lighthouse", "98 / 100"],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <dt className="w-[78px] shrink-0 text-faint">{k}</dt>
                  <dd className="truncate text-ink/90">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex gap-2">
              <div
                ref={btnRef}
                className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-[12.5px] font-medium transition-all duration-500 ${approved ? "bg-lime/15 text-lime ring-1 ring-lime/40" : "bg-lime text-lime-ink"}`}
              >
                <Icon.Check width={13} height={13} strokeWidth={2} />
                {approved ? "Aprobado" : "Aprobar"}
              </div>
              <div className="flex h-8 items-center rounded-md border border-white/10 px-3 text-[12.5px] text-muted">Comentar</div>
            </div>
          </div>
        </div>

        <div
          className={`mt-4 flex items-center gap-2.5 overflow-hidden rounded-[10px] border border-lime/20 bg-lime/[0.06] px-3 transition-all duration-700 ease-expo ${approved ? "max-h-14 py-2.5 opacity-100" : "max-h-0 py-0 opacity-0"}`}
        >
          <span className="size-1.5 animate-pulse-dot rounded-full bg-lime" />
          <span className="mono text-[12px] text-ink/85">publicado en producción · hace 2 s</span>
        </div>
      </div>

      <div ref={cursorRef} className="pointer-events-none absolute left-0 top-0 opacity-0">
        <svg width="20" height="20" viewBox="0 0 20 20" className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
          <path d="M3 2l13 7-5.5 1.5L9 16z" fill="#fff" stroke="#050605" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

const VITALS = [
  { k: "LCP", v: "1.1 s", pct: 0.82, note: "carga" },
  { k: "INP", v: "64 ms", pct: 0.9, note: "respuesta" },
  { k: "CLS", v: "0.01", pct: 0.96, note: "estabilidad" },
];

export function VitalsCard() {
  const ref = useRef<HTMLDivElement>(null);

  useOnEnter(ref, (el) => {
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline();
    tl.from(el.querySelectorAll("[data-vital]"), { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.out", stagger: 0.12 });
    tl.from(el.querySelectorAll("[data-up]"), { scaleY: 0, transformOrigin: "bottom", duration: 0.5, ease: "power3.out", stagger: 0.025 }, 0.2);
    return tl;
  });

  return (
    <div ref={ref} aria-hidden className="glass spot overflow-hidden">
      <div className="mono flex items-center justify-between border-b border-white/6 px-5 py-3.5 text-muted">
        <span className="text-ink/85">producción · últimos 7 días</span>
        <span className="flex items-center gap-2 text-lime">
          <span className="size-1.5 rounded-full bg-lime" /> sin errores
        </span>
      </div>
      <div className="space-y-4 p-5">
        {VITALS.map((m) => (
          <div key={m.k} className="grid grid-cols-[52px_1fr_64px] items-center gap-4">
            <span className="mono text-ink/90">{m.k}</span>
            <div className="relative h-1.5 rounded-full bg-white/6">
              <div
                data-vital
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-lime/40 to-lime shadow-[0_0_14px_-2px_var(--color-lime)]"
                style={{ width: `${m.pct * 100}%` }}
              />
            </div>
            <span className="mono text-right tabular-nums text-muted">{m.v}</span>
          </div>
        ))}
        <div className="pt-2">
          <div className="mono mb-2 flex justify-between text-[11px] text-faint">
            <span>disponibilidad</span>
            <span>99.98%</span>
          </div>
          <div className="flex h-8 items-end gap-[3px]">
            {Array.from({ length: 36 }, (_, i) => (
              <span
                key={i}
                data-up
                className={`flex-1 rounded-[2px] ${i === 23 ? "bg-lime/35" : "bg-lime/80"}`}
                style={{ height: `${i === 23 ? 55 : 78 + ((i * 37) % 22)}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

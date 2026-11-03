"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, site } from "@/content";
import { Icon, SectionHead } from "./ui";

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  // En escritorio la sección se fija y las tarjetas se desplazan en horizontal.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current!;
      const distance = () => Math.max(0, track.offsetWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          refreshPriority: 1,
          onUpdate: (self) => gsap.set(barRef.current, { scaleX: self.progress }),
        },
      });
      gsap.utils.toArray<HTMLElement>(".work-img", track).forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -7 },
          {
            xPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest("[data-card]"),
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  // Etiqueta ("ver sitio", "ver código"…) que sigue al cursor sobre las tarjetas.
  useEffect(() => {
    const label = labelRef.current!;
    const text = label.querySelector("[data-label-text]")!;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const xTo = gsap.quickTo(label, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(label, "y", { duration: 0.45, ease: "power3.out" });
    let shown = false;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const card = (e.target as Element).closest?.<HTMLElement>("[data-card]");
      const over = !!card;
      if (card?.dataset.cta) text.textContent = card.dataset.cta;
      if (over !== shown) {
        shown = over;
        gsap.to(label, { scale: over ? 1 : 0, opacity: over ? 1 : 0, duration: 0.35, ease: "back.out(2)" });
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <>
      <section ref={sectionRef} id="trabajo" data-scene="work" className="relative flex flex-col py-24 lg:h-svh lg:justify-center lg:py-0">
        <div className="shell lg:pt-16">
          <SectionHead
            pill="trabajo seleccionado"
            title={
              <>
                Proyectos que <em className="serif-i">salieron</em> a producción.
              </>
            }
            aside="Del sitio de un distribuidor de software a una plataforma de identidad y pagos. Más proyectos en mi GitHub."
          />
        </div>

        <div className="mt-12 lg:mt-10">
          <div
            ref={trackRef}
            className="shell flex flex-col gap-5 lg:w-max lg:max-w-none lg:flex-row lg:gap-6 lg:pl-[max(40px,calc((100vw-1240px)/2+40px))] lg:pr-[max(40px,calc((100vw-1240px)/2+40px))]"
          >
            {projects.map((p, i) => (
              <a
                key={p.title}
                href={p.href}
                target="_blank"
                rel="noopener"
                data-card
                data-cta={p.cta}
                data-reveal
                className="spot group relative block aspect-[4/5] w-full shrink-0 overflow-hidden rounded-[22px] border border-white/8 bg-[#0a0c09] sm:aspect-[16/11] lg:aspect-auto lg:h-[min(60vh,560px)] lg:w-[calc(min(60vh,560px)*1.42)] lg:cursor-none"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={p.cover}
                    alt=""
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="work-img scale-[1.18] object-cover transition-[scale] duration-[1400ms] ease-expo group-hover:scale-[1.26]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-bg/50 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                <div className="mono absolute inset-x-0 top-0 flex justify-between p-5 text-muted sm:p-6">
                  <span>
                    {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                  </span>
                  <span>{p.client}</span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <span className="mono inline-flex items-center gap-2 rounded-md bg-lime px-2 py-1 text-[11px] font-medium text-lime-ink">
                    {p.metric}
                  </span>
                  <h3 className="mt-4 text-[clamp(28px,3vw,44px)] font-medium leading-none tracking-[-0.035em]">{p.title}</h3>
                  <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                    <p className="max-w-[42ch] text-[14px] leading-relaxed text-muted">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span key={t} className="mono rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-ink/80 backdrop-blur">
                          {t}
                        </span>
                      ))}
                      {/* En pantallas táctiles no hay etiqueta que siga al cursor */}
                      <span className="mono inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[11px] text-ink lg:hidden">
                        {p.cta} <Icon.Arrow width={11} height={11} />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="shell mt-10 flex items-center gap-6">
          <div className="hidden h-px flex-1 bg-white/8 lg:block">
            <div ref={barRef} className="h-px w-full origin-left scale-x-0 bg-lime shadow-[0_0_12px_var(--color-lime)]" />
          </div>
          <a href={site.github} target="_blank" rel="noopener" className="mono inline-flex shrink-0 items-center gap-1.5 text-muted transition-colors hover:text-lime">
            más proyectos en GitHub <Icon.Arrow width={12} height={12} />
          </a>
        </div>
      </section>

      {/* Fuera de la sección: un ancestro fijado por ScrollTrigger rompería el position: fixed */}
      <div
        ref={labelRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] -ml-[46px] -mt-[46px] grid size-[92px] scale-0 place-items-center rounded-full bg-lime text-[12px] font-medium text-lime-ink opacity-0"
      >
        <span className="flex items-center gap-1">
          <span data-label-text>ver sitio</span> <Icon.Arrow width={12} height={12} />
        </span>
      </div>
    </>
  );
}

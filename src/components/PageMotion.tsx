"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { motion, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Animaciones genéricas que se activan con atributos en el HTML:
 *  data-hero         entrada del hero (en orden de aparición)
 *  data-hero-title   titular del hero, se revela por líneas
 *  data-split        titulares que se revelan por líneas al hacer scroll
 *  data-reveal       aparece subiendo al entrar en pantalla
 *  data-count="97"   contador de 0 al valor
 *  data-draw         trazo SVG que se dibuja
 *  data-fill         barra que crece desde la izquierda
 *  data-magnetic     el botón persigue un poco al cursor
 *  .spot             halo que sigue al cursor (variables --mx / --my)
 */
export default function PageMotion() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const off: (() => void)[] = [];

    const onSpot = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(".spot") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onSpot, { passive: true });
    off.push(() => window.removeEventListener("pointermove", onSpot));

    if (reduced) return () => off.forEach((f) => f());

    if (window.matchMedia("(pointer: fine)").matches) {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.3);
          yTo((e.clientY - r.top - r.height / 2) * 0.4);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        off.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }

    const ctx = gsap.context(() => {});

    document.fonts.ready.then(() => {
      ctx.add(() => {
        // Entrada del hero
        const title = document.querySelector<HTMLElement>("[data-hero-title]");
        const items = gsap.utils.toArray<HTMLElement>("[data-hero]").filter((el) => el !== title);
        if (title) {
          SplitText.create(title, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) => {
              gsap.set(title, { opacity: 1 });
              return gsap.from(self.lines, { yPercent: 115, duration: 1.3, ease: "expo.out", stagger: 0.12, delay: 0.1 });
            },
          });
        }
        gsap.fromTo(
          items,
          { opacity: 0, y: 26, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "expo.out", stagger: 0.09, delay: 0.35, clearProps: "filter" },
        );

        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 115,
                duration: 1.15,
                ease: "expo.out",
                stagger: 0.09,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              }),
          });
        });

        const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
        gsap.set(reveals, { opacity: 0, y: 30 });
        ScrollTrigger.batch(reveals, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, overwrite: true }),
        });

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const v = { n: 0 };
          el.textContent = "0";
          gsap.to(v, {
            n: end,
            duration: 2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
            onUpdate: () => (el.textContent = Math.round(v.n).toLocaleString("es-MX")),
          });
        });

        gsap.utils.toArray<SVGPathElement>("[data-draw]").forEach((p) => {
          const len = p.getTotalLength();
          gsap.fromTo(
            p,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              duration: 2,
              ease: "power2.inOut",
              scrollTrigger: { trigger: p, start: "top 92%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-fill]").forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: "left center",
              duration: 1.4,
              delay: Number(el.dataset.fill || 0),
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 94%", once: true },
            },
          );
        });
      });
      ScrollTrigger.refresh();
      // Con un enlace directo (#contacto…) el navegador saltó antes de que existiera el
      // espacio de la sección fijada: se vuelve a la sección ya con las medidas finales.
      const target = location.hash && document.querySelector(location.hash);
      if (target) motion.lenis ? motion.lenis.scrollTo(target as HTMLElement, { immediate: true, offset: -72 }) : target.scrollIntoView();
    });

    return () => {
      off.forEach((f) => f());
      ctx.revert();
    };
  }, []);

  return null;
}

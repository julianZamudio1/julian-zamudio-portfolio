"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.09, anchors: { offset: -72 } });
    motion.lenis = lenis;
    if (process.env.NODE_ENV === "development") Object.assign(window, { __lenis: lenis });
    lenis.on("scroll", (e: Lenis) => {
      motion.velocity = e.velocity;
      ScrollTrigger.update();
    });
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      motion.lenis = null;
    };
  }, []);

  return null;
}

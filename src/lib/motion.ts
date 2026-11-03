import type Lenis from "lenis";

// Estado compartido entre el scroll suave y la escena WebGL.
export const motion: { lenis: Lenis | null; velocity: number } = {
  lenis: null,
  velocity: 0,
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

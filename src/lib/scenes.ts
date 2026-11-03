// Composiciones de la escena de filamentos, una por sección.
// Los puntos de control van en unidades de viewport: x e y entre -1 y 1
// (fuera de ese rango = fuera de pantalla). La curva es una Bézier cúbica p0 → p3.
export type SceneState = {
  p0x: number;
  p0y: number;
  p1x: number;
  p1y: number;
  p2x: number;
  p2y: number;
  p3x: number;
  p3y: number;
  /** Ancho del haz lejos del punto de convergencia. */
  spread: number;
  /** Dónde se estrechan los filamentos (0 = inicio, 1 = final de la curva). */
  pinch: number;
  /** Cuánto gira el haz sobre sí mismo a lo largo de la curva. */
  twist: number;
  /** Grosor en profundidad (0 = cinta plana). */
  depth: number;
  intensity: number;
};

export type SceneName = "hero" | "work" | "process" | "bento" | "numbers" | "contact";

export const SCENES: Record<SceneName, SceneState> = {
  hero: {
    p0x: 0.75, p0y: -1.45,
    p1x: -1.05, p1y: -0.75,
    p2x: -0.1, p2y: 0.55,
    p3x: 1.45, p3y: 0.75,
    spread: 1.15, pinch: 0.36, twist: 2.4, depth: 0.45, intensity: 1,
  },
  work: {
    p0x: -1.5, p0y: -0.55,
    p1x: -0.4, p1y: -1.25,
    p2x: 0.45, p2y: -0.35,
    p3x: 1.5, p3y: -0.95,
    spread: 0.9, pinch: 0.5, twist: 3.2, depth: 0.5, intensity: 0.5,
  },
  process: {
    p0x: -1.3, p0y: 1.45,
    p1x: -0.35, p1y: 0.35,
    p2x: -1.15, p2y: -0.35,
    p3x: -0.3, p3y: -1.5,
    spread: 0.85, pinch: 0.45, twist: 2.2, depth: 0.5, intensity: 0.62,
  },
  bento: {
    p0x: 0.15, p0y: 1.5,
    p1x: 0.55, p1y: 0.55,
    p2x: 1.25, p2y: 0.65,
    p3x: 1.55, p3y: -0.35,
    spread: 0.85, pinch: 0.4, twist: 2.8, depth: 0.5, intensity: 0.5,
  },
  numbers: {
    p0x: -1.5, p0y: -1.25,
    p1x: -0.55, p1y: 0.45,
    p2x: 0.55, p2y: -1.05,
    p3x: 1.5, p3y: -0.25,
    spread: 1.0, pinch: 0.42, twist: 2.6, depth: 0.45, intensity: 0.6,
  },
  contact: {
    p0x: -1.5, p0y: 0.55,
    p1x: -0.45, p1y: 0.95,
    p2x: 0.45, p2y: 0.25,
    p3x: 1.5, p3y: 0.7,
    spread: 0.75, pinch: 0.55, twist: 3.6, depth: 0.35, intensity: 0.85,
  },
};

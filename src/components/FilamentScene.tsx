"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import gsap from "gsap";
import poster from "@/assets/hero-poster.webp";
import { motion, prefersReducedMotion } from "@/lib/motion";
import { SCENES, type SceneName, type SceneState } from "@/lib/scenes";

// Cada filamento es una polilínea sobre una Bézier compartida; el vertex shader
// la desplaza (abanico, giro, ondas, cursor) para que todo el trabajo viva en la GPU.
const VERT = /* glsl */ `
uniform float uTime;
uniform vec2 uView;
uniform vec2 uP0;
uniform vec2 uP1;
uniform vec2 uP2;
uniform vec2 uP3;
uniform float uSpread;
uniform float uPinch;
uniform float uTwist;
uniform float uDepth;
uniform float uIntensity;
uniform float uVelocity;
uniform vec3 uMouse;
uniform float uPointSize;
uniform float uPixelRatio;

attribute float aT;
attribute vec4 aSeed;

varying vec3 vColor;
varying float vAlpha;

vec2 bez(float t) {
  float u = 1.0 - t;
  return u * u * u * uP0 + 3.0 * u * u * t * uP1 + 3.0 * u * t * t * uP2 + t * t * t * uP3;
}

vec2 bezD(float t) {
  float u = 1.0 - t;
  return 3.0 * u * u * (uP1 - uP0) + 6.0 * u * t * (uP2 - uP1) + 3.0 * t * t * (uP3 - uP2);
}

void main() {
  float t = aT;
  #ifdef IS_POINTS
    t = fract(aT + uTime * (0.012 + aSeed.y * 0.025));
  #endif

  vec2 c = bez(t) * uView;
  vec2 tg = normalize(bezD(t) * uView + 1e-5);
  vec3 N = vec3(-tg.y, tg.x, 0.0);
  vec3 B = vec3(0.0, 0.0, 1.0);

  float dp = abs(t - uPinch);
  float env = mix(0.07, 1.0, smoothstep(0.0, 0.55, dp));

  float o1 = aSeed.x * 2.0 - 1.0;
  o1 = sign(o1) * pow(abs(o1), 1.55);
  float o2 = aSeed.z * 2.0 - 1.0;
  float wob = sin(t * 9.0 * (0.6 + aSeed.y) + uTime * (0.3 + aSeed.w * 0.45) + aSeed.w * 30.0);

  float w1 = uSpread * env * (o1 + wob * 0.06 * (0.3 + env));
  float w2 = uSpread * env * o2 * uDepth;
  float ang = t * uTwist + uTime * 0.06;
  float ca = cos(ang);
  float sa = sin(ang);
  vec3 p = vec3(c, 0.0) + N * (w1 * ca - w2 * sa) + B * (w1 * sa + w2 * ca);

  p.xy += N.xy * sin(t * 22.0 + uTime * 2.5 + aSeed.y * 40.0) * uVelocity * 0.035 * env;

  vec2 dm = p.xy - uMouse.xy;
  float md2 = dot(dm, dm);
  p.xy += normalize(dm + 1e-5) * uMouse.z * exp(-md2 / 0.8) * (0.3 + 0.7 * env);

  #ifdef IS_POINTS
    p += vec3(
      sin(aSeed.w * 50.0 + uTime * 0.5),
      cos(aSeed.x * 50.0 + uTime * 0.4),
      sin(aSeed.y * 40.0)
    ) * 0.14 * env;
  #endif

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float core = 1.0 - smoothstep(0.0, 0.3, dp);
  float centerness = 1.0 - abs(o1);
  float ends = smoothstep(0.0, 0.1, t) * (1.0 - smoothstep(0.8, 1.0, t));
  float pulse = pow(fract(t * 1.3 - uTime * (0.09 + aSeed.y * 0.11) + aSeed.x * 7.0), 26.0);

  vec3 lime = vec3(0.78, 0.94, 0.24);
  vec3 teal = vec3(0.16, 0.8, 0.78);
  vec3 col = mix(lime, teal, smoothstep(0.6, 1.0, aSeed.w) * smoothstep(0.1, 0.7, dp));
  col = mix(col, vec3(1.0, 1.0, 0.86), core * centerness * 0.75);
  vColor = pow(col, vec3(2.2));

  #ifdef IS_POINTS
    float tw = 0.5 + 0.5 * sin(uTime * (1.0 + aSeed.y * 3.0) + aSeed.x * 20.0);
    vAlpha = ends * (0.2 + 0.8 * tw) * uIntensity;
    gl_PointSize = uPointSize * uPixelRatio * (0.4 + aSeed.z * 1.6) * (10.0 / -mv.z);
  #else
    vAlpha = ends * (0.028 + 0.05 * core * centerness + pulse * 0.45) * uIntensity;
  #endif
}
`;

const FRAG = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  float a = vAlpha;
  #ifdef IS_POINTS
    a *= smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
  #endif
  gl_FragColor = vec4(vColor, a);
}
`;

// Cientos de filamentos sumándose en el núcleo dan valores HDR enormes; sin comprimirlos
// el bloom los esparce por toda la pantalla y el negro se vuelve gris.
const SoftClamp = {
  uniforms: { tDiffuse: { value: null } },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      gl_FragColor = vec4(1.0 - exp(-c.rgb * 1.4), 1.0);
    }
  `,
};

function strandGeometry(count: number, segments: number) {
  const total = count * segments;
  const aT = new Float32Array(total);
  const aSeed = new Float32Array(total * 4);
  const index = new Uint32Array(count * (segments - 1) * 2);
  let k = 0;
  for (let s = 0; s < count; s++) {
    const seed = [Math.random(), Math.random(), Math.random(), Math.random()];
    for (let i = 0; i < segments; i++) {
      const v = s * segments + i;
      aT[v] = i / (segments - 1);
      aSeed.set(seed, v * 4);
      if (i < segments - 1) {
        index[k++] = v;
        index[k++] = v + 1;
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(total * 3), 3));
  g.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
  g.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 4));
  g.setIndex(new THREE.BufferAttribute(index, 1));
  return g;
}

function sparkGeometry(count: number) {
  const aT = new Float32Array(count);
  const aSeed = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    aT[i] = Math.random();
    aSeed.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  g.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
  g.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 4));
  return g;
}

export default function FilamentScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const reduced = prefersReducedMotion();
    const small = window.matchMedia("(max-width: 768px)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
    } catch {
      return; // sin WebGL se queda el póster estático
    }
    const dpr = Math.min(window.devicePixelRatio, small ? 1.25 : 1.5);
    renderer.setPixelRatio(dpr);
    // Negro puro: un tono casi negro sale gris porque el composer lo codifica a sRGB dos veces.
    renderer.setClearColor(0x000000, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    const state: SceneState = { ...SCENES.hero };
    const uniforms = {
      uTime: { value: 0 },
      uView: { value: new THREE.Vector2(1, 1) },
      uP0: { value: new THREE.Vector2() },
      uP1: { value: new THREE.Vector2() },
      uP2: { value: new THREE.Vector2() },
      uP3: { value: new THREE.Vector2() },
      uSpread: { value: 1 },
      uPinch: { value: 0.4 },
      uTwist: { value: 2 },
      uDepth: { value: 0.4 },
      uIntensity: { value: 1 },
      uVelocity: { value: 0 },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
      uPointSize: { value: small ? 2.2 : 2.6 },
      uPixelRatio: { value: dpr },
    };

    const shared = {
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    };
    const strands = new THREE.LineSegments(
      strandGeometry(small ? 380 : 720, small ? 90 : 140),
      new THREE.ShaderMaterial(shared),
    );
    const sparks = new THREE.Points(
      sparkGeometry(small ? 500 : 1100),
      new THREE.ShaderMaterial({ ...shared, defines: { IS_POINTS: "" } }),
    );
    strands.frustumCulled = false;
    sparks.frustumCulled = false;
    scene.add(strands, sparks);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new ShaderPass(SoftClamp));
    const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), small ? 0.55 : 0.7, 0.45, 0.12);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    if (process.env.NODE_ENV === "development") {
      Object.assign(window, { __filaments: { renderer, composer, bloom, uniforms, strands, sparks, state } });
    }

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      uniforms.uView.value.set(halfH * camera.aspect, halfH);
    };
    resize();
    window.addEventListener("resize", resize);

    // Cursor: posición en el plano z = 0, suavizada; la fuerza baja si el puntero se va.
    const pointer = { x: 0, y: 0, active: 0 };
    const smooth = { x: 0, y: 0, strength: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointer.active = e.pointerType === "mouse" ? 1 : 0;
    };
    const onLeave = () => (pointer.active = 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    // Cambia de composición según la sección que cruza el centro de la pantalla.
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    let current: SceneName = "hero";
    const pickScene = () => {
      const mid = window.innerHeight / 2;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          const name = el.dataset.scene as SceneName;
          if (name !== current && SCENES[name]) {
            current = name;
            gsap.to(state, { ...SCENES[name], duration: reduced ? 0 : 2.2, ease: "power3.inOut", overwrite: "auto" });
          }
          return;
        }
      }
    };
    pickScene();
    window.addEventListener("scroll", pickScene, { passive: true });

    const clock = new THREE.Clock();
    let first = true;
    let velocity = 0;
    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!reduced) uniforms.uTime.value += dt;
      else uniforms.uTime.value = 12;

      const u = uniforms;
      // En pantallas angostas el texto ocupa todo el ancho: el haz se corre a la derecha y,
      // en vertical, también hacia abajo (detrás de la tarjeta del hero).
      const narrow = camera.aspect < 0.8 ? 0.6 : camera.aspect < 1.2 ? 0.4 : 0;
      const drop = camera.aspect < 0.8 ? -0.35 : 0;
      u.uP0.value.set(state.p0x + narrow, state.p0y + drop);
      u.uP1.value.set(state.p1x + narrow, state.p1y + drop);
      u.uP2.value.set(state.p2x + narrow, state.p2y + drop);
      u.uP3.value.set(state.p3x + narrow, state.p3y + drop);
      const scale = Math.min(u.uView.value.x, u.uView.value.y * 1.2) / 3.15;
      u.uSpread.value = state.spread * scale;
      u.uPinch.value = state.pinch;
      u.uTwist.value = state.twist;
      u.uDepth.value = state.depth;
      u.uIntensity.value = state.intensity * (narrow ? 0.65 : 1);

      velocity += (Math.min(Math.abs(motion.velocity), 60) / 60 - velocity) * 0.08;
      u.uVelocity.value = reduced ? 0 : velocity;

      const k = 1 - Math.pow(0.001, dt);
      smooth.x += (pointer.x - smooth.x) * k;
      smooth.y += (pointer.y - smooth.y) * k;
      smooth.strength += ((reduced ? 0 : pointer.active * 0.55) - smooth.strength) * k * 0.6;
      u.uMouse.value.set(smooth.x * u.uView.value.x, smooth.y * u.uView.value.y, smooth.strength);

      if (!reduced) {
        camera.position.x += (smooth.x * 0.35 - camera.position.x) * k * 0.5;
        camera.position.y += (smooth.y * 0.25 - camera.position.y) * k * 0.5;
        camera.lookAt(0, 0, 0);
      }

      composer.render();

      if (first) {
        first = false;
        gsap.to(canvas, { opacity: 1, duration: 1.4, ease: "power2.out" });
        gsap.to(posterRef.current, { opacity: 0, duration: 1.4, ease: "power2.out", delay: 0.2 });
      }
    };
    renderer.setAnimationLoop(tick);

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", pickScene);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(state);
      strands.geometry.dispose();
      sparks.geometry.dispose();
      (strands.material as THREE.Material).dispose();
      (sparks.material as THREE.Material).dispose();
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-lvh w-full overflow-hidden bg-bg">
      <div ref={posterRef} className="absolute inset-0">
        <Image src={poster} alt="" fill priority sizes="100vw" className="object-cover object-right opacity-70" />
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-0" />
      {/* Viñeta para que el texto siempre se lea sobre la luz */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_40%,transparent_30%,rgba(5,6,5,0.55)_75%,rgba(5,6,5,0.9)_100%)]" />
    </div>
  );
}

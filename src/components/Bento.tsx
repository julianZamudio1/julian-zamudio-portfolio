import { DeviceMorph, LighthouseRings } from "./BentoWidgets";
import { Logo, SectionHead } from "./ui";

const ORBIT = [
  { short: "NX", label: "next.js", x: 70, y: 52 },
  { short: "3D", label: "three.js", x: 430, y: 52 },
  { short: "TS", label: "typescript", x: 70, y: 168 },
  { short: "GS", label: "gsap", x: 430, y: 168 },
];

function StackOrbit() {
  return (
    <div aria-hidden className="relative mx-auto aspect-[500/220] w-full max-w-[500px]">
      <svg viewBox="0 0 500 220" className="absolute inset-0 h-full w-full">
        {ORBIT.map((n, i) => {
          const d = `M${n.x} ${n.y} C ${(n.x + 250) / 2} ${n.y} ${(n.x + 250) / 2} 110 250 110`;
          return (
            <g key={n.short}>
              <path d={d} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeDasharray="3 5" />
              <path
                d={d}
                pathLength={100}
                fill="none"
                stroke="var(--color-lime)"
                strokeWidth="1.6"
                className="flow"
                style={{ animationDelay: `${i * -0.6}s` }}
              />
            </g>
          );
        })}
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 -m-6 rounded-[28px] bg-lime/25 blur-2xl" />
        <Logo size={64} className="relative" />
      </div>
      {ORBIT.map((n) => (
        <div
          key={n.short}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
          style={{ left: `${(n.x / 500) * 100}%`, top: `${(n.y / 220) * 100}%` }}
        >
          <span className="chip grid size-10 place-items-center font-mono text-[12px] text-ink/90 transition-colors hover:border-lime/50">
            {n.short}
          </span>
          <span className="mono text-[10.5px] text-faint">{n.label}</span>
        </div>
      ))}
    </div>
  );
}

const cardClass = "glass spot flex flex-col overflow-hidden p-6 sm:p-7";

export default function Bento() {
  return (
    <section id="stack" data-scene="bento" className="relative py-28 lg:py-36">
      <div className="shell">
        <SectionHead
          pill="detalles"
          title={
            <>
              <em className="serif-i">Obsesión</em> por lo que no se ve.
            </>
          }
          aside="Rendimiento, accesibilidad y SEO técnico. Lo que nadie presume en un demo, pero decide si tu sitio vende."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          <article data-reveal className={`${cardClass} md:col-span-3`}>
            <h3 className="text-[20px] font-medium tracking-[-0.02em]">Un stack, todo conectado</h3>
            <p className="mt-2 max-w-[40ch] text-[14px] leading-relaxed text-muted">
              Las mismas herramientas en cada proyecto. Menos sorpresas, entregas más rápidas y código que otro equipo puede mantener.
            </p>
            <div className="mt-8 flex flex-1 items-center">
              <StackOrbit />
            </div>
          </article>

          <article data-reveal className={`${cardClass} md:col-span-3`}>
            <h3 className="text-[20px] font-medium tracking-[-0.02em]">Rápido en cualquier conexión</h3>
            <p className="mt-2 max-w-[40ch] text-[14px] leading-relaxed text-muted">
              Mido con Lighthouse antes de cada entrega. Si una animación cuesta rendimiento, se optimiza o se va.
            </p>
            <div className="mt-10 flex flex-1 items-center">
              <LighthouseRings />
            </div>
          </article>

          <article data-reveal className={`${cardClass} md:col-span-2`}>
            <h3 className="text-[18px] font-medium tracking-[-0.02em]">Accesible por defecto</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">Navegable con teclado, contraste AA y textos para lectores de pantalla.</p>
            <div aria-hidden className="mt-8 flex flex-1 items-end gap-2">
              {["Tab", "⇧", "↵"].map((k, i) => (
                <span
                  key={k}
                  className={`grid h-11 place-items-center rounded-[9px] border-b-[3px] font-mono text-[12px] ${i === 0 ? "w-20 border-lime/60 bg-lime/15 text-lime" : "w-11 border-white/12 bg-white/[0.05] text-muted"}`}
                >
                  {k}
                </span>
              ))}
              <span className="mono ml-auto rounded-md border border-white/10 px-2 py-1 text-[11px] text-ink/80">AA · 7.2:1</span>
            </div>
          </article>

          <article data-reveal className={`${cardClass} md:col-span-2`}>
            <h3 className="text-[18px] font-medium tracking-[-0.02em]">Responsive de verdad</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">Diseñado primero para el teléfono, donde está la mayoría de tus visitas.</p>
            <div className="mt-6 flex-1">
              <DeviceMorph />
            </div>
          </article>

          <article data-reveal className={`${cardClass} md:col-span-2`}>
            <h3 className="text-[18px] font-medium tracking-[-0.02em]">SEO técnico incluido</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">Metadatos, sitemap e imágenes para compartir listos desde el primer deploy.</p>
            <div aria-hidden className="mono mt-8 flex flex-1 flex-col justify-end gap-1.5 text-[11.5px]">
              {["<title> ✓", "og:image ✓", "sitemap.xml ✓", "schema.org ✓"].map((t, i) => (
                <span key={t} className="flex items-center gap-2 text-muted">
                  <span className={`size-1.5 rounded-full ${i < 3 ? "bg-lime" : "bg-lime/50"}`} />
                  {t}
                </span>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

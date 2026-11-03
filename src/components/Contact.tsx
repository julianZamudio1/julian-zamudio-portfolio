import { site } from "@/content";
import ContactForm from "./ContactForm";
import { Logo } from "./ui";

const nav = [
  { href: "#trabajo", label: "Trabajo" },
  { href: "#proceso", label: "Proceso" },
  { href: "#stack", label: "Stack" },
  { href: "#contacto", label: "Contacto" },
];

export default function Contact() {
  return (
    <section id="contacto" data-scene="contact" className="relative pb-10 pt-40 lg:pt-56">
      <div className="shell">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.55fr]">
          <div data-reveal className="glass spot relative flex min-h-[300px] flex-col justify-between overflow-hidden p-7">
            <span aria-hidden className="pointer-events-none absolute -right-10 -top-8 select-none font-mono text-[200px] font-bold leading-none text-white/[0.03]">
              {site.initials}
            </span>
            <div className="flex items-center gap-2.5 text-[15px] font-medium">
              <Logo />
              {site.shortName}
            </div>
            <div>
              <p className="max-w-[24ch] text-[22px] leading-snug tracking-[-0.02em]">
                Webs que se sienten <em className="serif-i text-lime">vivas</em>, y que además venden.
              </p>
              <div className="mono mt-5 space-y-1.5 text-[12px]">
                <a href={`mailto:${site.email}`} className="block text-muted transition-colors hover:text-lime">
                  {site.email}
                </a>
                <a href={site.whatsappHref} target="_blank" rel="noopener" className="block text-muted transition-colors hover:text-lime">
                  WhatsApp {site.whatsapp}
                </a>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-5">
                <span className="mono text-faint">sígueme</span>
                <div className="flex gap-1.5">
                  {site.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener"
                      aria-label={s.label}
                      className="mono grid size-8 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-[11px] text-muted transition-colors hover:border-lime/50 hover:text-lime"
                    >
                      {s.short}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div data-reveal className="relative overflow-hidden rounded-[18px] bg-lime p-7 text-lime-ink sm:p-10">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-white/40 blur-3xl" />
            <p className="mono relative text-lime-ink/60">qué sigue</p>
            <h2 className="relative mt-4 max-w-[17ch] text-[clamp(32px,4vw,52px)] font-medium leading-[1.02] tracking-[-0.04em]">
              Cuéntame el proyecto que <em className="serif-i">más</em> te urge.
            </h2>
            <p className="relative mt-4 max-w-[46ch] text-[15px] leading-relaxed text-lime-ink/70">
              Escríbeme qué necesitas y te respondo con una propuesta y los siguientes pasos. Sin llamadas de venta.
            </p>
            <div className="relative max-w-[640px]">
              <ContactForm />
            </div>
          </div>
        </div>

        <div className="mono mt-14 flex flex-col gap-3 border-y border-white/8 py-5 text-faint sm:flex-row sm:items-center sm:justify-between">
          {[site.availability, "100% remoto", "La Piedad, Michoacán"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-lime" />
              {t}
            </span>
          ))}
        </div>

        <footer className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5 text-[15px] font-medium">
              <Logo />
              {site.shortName}
            </div>
            <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-muted">
              {site.role}. Sitios y aplicaciones de punta a punta: frontend, APIs, bases de datos e IA.
            </p>
          </div>
          <FooterCol title="navegación" links={nav} />
          <FooterCol title="redes" links={site.socials.map((s) => ({ href: s.href, label: s.label }))} />
          <FooterCol
            title="contacto"
            links={[
              { href: `mailto:${site.email}`, label: site.email },
              { href: site.whatsappHref, label: `WhatsApp ${site.whatsapp}` },
              { href: site.cv, label: "Descargar CV" },
            ]}
          />
        </footer>

        <div className="mono flex flex-col gap-2 border-t border-white/8 pt-6 text-[11px] text-faint sm:flex-row sm:justify-between">
          <span>
            © 2026 {site.name}
          </span>
          <span>Hecho con Next.js, Three.js y GSAP</span>
        </div>
      </div>
    </section>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="mono text-faint">{title}</p>
      <ul className="mt-4 space-y-2.5 text-[14px]">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-muted transition-colors hover:text-ink">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

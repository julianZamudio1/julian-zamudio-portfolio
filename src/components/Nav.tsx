"use client";

import { useEffect, useState } from "react";
import { site } from "@/content";
import { Logo } from "./ui";

const links = [
  { href: "#trabajo", label: "Trabajo" },
  { href: "#proceso", label: "Proceso" },
  { href: "#stack", label: "Stack" },
  { href: "#contacto", label: "Contacto" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-hero
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? "border-white/6 bg-bg/60 backdrop-blur-xl" : "border-transparent"
      }`}
    >
      <nav className="shell flex h-[68px] items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-2.5 text-[15px] font-medium tracking-tight">
          <Logo />
          <span>{site.shortName}</span>
        </a>

        <ul className="hidden items-center gap-8 text-[13px] text-muted md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <span className="pill hidden lg:inline-flex">
            <span className="pill-dot animate-pulse-dot rounded-full" />
            {site.availability}
          </span>
          <a href="#contacto" data-magnetic className="btn btn-lime h-9 px-4 text-[13px]">
            Hablemos
          </a>
        </div>
      </nav>
    </header>
  );
}

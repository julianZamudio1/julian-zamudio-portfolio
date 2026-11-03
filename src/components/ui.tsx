import type { ReactNode, SVGProps } from "react";
import { site } from "@/content";

export function Logo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-[28%] bg-lime font-mono font-bold text-lime-ink shadow-[0_0_24px_-4px_rgb(200_240_60/0.7)] ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {site.initials}
    </span>
  );
}

export function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`pill ${className}`}>
      <span className="pill-dot" />
      {children}
    </span>
  );
}

export function SectionHead({
  pill,
  title,
  aside,
}: {
  pill: string;
  title: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-[1.25fr_1fr] md:items-end">
      <div>
        <div data-reveal>
          <Pill>{pill}</Pill>
        </div>
        <h2
          data-split
          className="mt-5 max-w-[16ch] text-[clamp(34px,4.6vw,60px)] font-medium leading-[1.02] tracking-[-0.035em] text-balance"
        >
          {title}
        </h2>
      </div>
      {aside && (
        <p data-reveal className="max-w-[44ch] text-[15px] leading-relaxed text-muted md:justify-self-end">
          {aside}
        </p>
      )}
    </div>
  );
}

type IconProps = SVGProps<SVGSVGElement>;
const base = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const Icon = {
  Arrow: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M4 12 12 4M6 4h6v6" />
    </svg>
  ),
  Down: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M8 3v10M4 9l4 4 4-4" />
    </svg>
  ),
  Cursor: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="m4 3 8 4.5-3.5 1-1 3.5z" />
    </svg>
  ),
  Plus: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M8 3v10M3 8h10" />
    </svg>
  ),
  Branch: (p: IconProps) => (
    <svg {...base} {...p}>
      <circle cx="5" cy="4" r="1.5" />
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="11" cy="6" r="1.5" />
      <path d="M5 5.5v5M11 7.5c0 2-6 1.5-6 3" />
    </svg>
  ),
  Check: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  ),
  Clock: (p: IconProps) => (
    <svg {...base} {...p}>
      <circle cx="8" cy="8" r="5.5" />
      <path d="M8 5v3l2 1.5" />
    </svg>
  ),
  Play: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M5 3.5v9l7-4.5z" fill="currentColor" />
    </svg>
  ),
};

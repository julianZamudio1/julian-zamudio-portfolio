import { hero, site, stack } from "@/content";
import PipelineCard from "./PipelineCard";
import { Icon, Pill } from "./ui";

export default function Hero() {
  return (
    <section id="top" data-scene="hero" className="relative overflow-x-clip">
      <div className="shell grid min-h-[100svh] items-center gap-14 pb-16 pt-32 lg:grid-cols-[1.15fr_1fr] lg:gap-4 lg:pb-24 lg:pt-28">
        <div className="relative z-10">
          <div data-hero>
            <Pill>{hero.badge}</Pill>
          </div>

          <h1
            data-hero
            data-hero-title
            className="mt-7 text-[clamp(42px,5.5vw,86px)] font-medium leading-[0.98] tracking-[-0.045em]"
          >
            <span className="block">{hero.titleTop}</span>
            <span className="serif-i block pr-[0.08em] text-[1.08em] leading-[0.95]">{hero.titleAccent}</span>
          </h1>

          <p data-hero className="mt-7 max-w-[46ch] text-[16px] leading-relaxed text-muted">
            {hero.lead}
          </p>

          <div data-hero className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#trabajo" data-magnetic className="btn btn-lime">
              {hero.primary}
              <Icon.Down width={14} height={14} />
            </a>
            <a href={site.cv} data-magnetic className="btn btn-ghost">
              <Icon.Play width={11} height={11} className="text-lime" />
              {hero.secondary}
            </a>
          </div>

          <p data-hero className="mono mt-6 text-faint">
            {hero.note}
          </p>
        </div>

        <div data-hero className="relative lg:-mr-[14%] lg:translate-x-[4%]">
          <PipelineCard />
        </div>
      </div>

      <div data-hero className="relative border-y border-white/6 bg-bg/40 py-5 backdrop-blur-sm">
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <ul className="animate-marquee flex shrink-0 items-center gap-12 pr-12 hover:[animation-play-state:paused]">
            {[...stack, ...stack].map((s, i) => (
              <li key={i} className="mono flex items-center gap-12 whitespace-nowrap text-[13px] text-muted" aria-hidden={i >= stack.length}>
                {s}
                <span className="size-1 rounded-[1px] bg-lime/70" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

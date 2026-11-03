import { process } from "@/content";
import { BriefCard, ChatCard, VitalsCard } from "./ProcessCards";
import { SectionHead } from "./ui";

const cards = [BriefCard, ChatCard, VitalsCard];

export default function Process() {
  return (
    <section id="proceso" data-scene="process" className="relative py-28 lg:py-40">
      <div className="shell">
        <SectionHead
          pill="cómo trabajo"
          title={
            <>
              Sin sorpresas, <em className="serif-i">por diseño.</em>
            </>
          }
          aside="Tres pasos, siempre los mismos. Sabes en qué estoy, qué sigue y qué necesito de ti, sin perseguirme por correo."
        />

        <div className="mt-20 space-y-24 lg:mt-28 lg:space-y-36">
          {process.map((step, i) => {
            const Card = cards[i];
            const flip = i % 2 === 1;
            return (
              <div key={step.n} className="grid items-center gap-10 md:grid-cols-2 lg:gap-20">
                <div data-reveal className={flip ? "md:order-2" : ""}>
                  <Card />
                </div>
                <div className={flip ? "md:order-1 md:pl-8" : "md:pr-8"}>
                  <p data-reveal className="mono text-lime">
                    {step.n}
                  </p>
                  <h3 data-split className="mt-3 text-[clamp(28px,3vw,40px)] font-medium leading-[1.05] tracking-[-0.03em]">
                    {step.title}
                  </h3>
                  <p data-reveal className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-muted">
                    {step.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

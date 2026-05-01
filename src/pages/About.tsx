import { SiteLayout } from "@/components/SiteLayout";
import { FarmContact } from "@/components/FarmContact";
import aboutBark from "@/assets/about-bark.jpg";

const About = () => (
  <SiteLayout>
    <section className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-12">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">Our story</p>
      <h1 className="font-display text-4xl md:text-6xl max-w-3xl leading-[1.05]">
        Three generations of birch, raised in the Korean highlands.
      </h1>
    </section>

    <section className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10 pb-20">
      <div className="md:col-span-5">
        <img
          src={aboutBark}
          alt="Detail of Korean white birch bark"
          loading="lazy"
          width={1280}
          height={1280}
          className="w-full aspect-square object-cover"
        />
      </div>
      <div className="md:col-span-6 md:col-start-7 flex flex-col gap-6 text-base leading-relaxed text-muted-foreground">
        <p>
          Our nursery sits at the edge of a forest in Gangwon Province, where cool nights and clean mountain
          air give Korean white birch — Betula platyphylla — its trademark luminous bark.
        </p>
        <p>
          Each tree is grown slowly, the way our grandfather taught us. We don't force growth. We don't
          chemically treat the bark. We let the climate, the soil, and time do the work.
        </p>
        <p>
          When a tree is ready, we hand-select it, prepare its roots, and ship it directly to you — anywhere
          in the world — so a piece of the Korean forest can take root in your garden.
        </p>
      </div>
    </section>

    <FarmContact />
  </SiteLayout>
);

export default About;

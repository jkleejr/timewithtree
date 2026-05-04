import { SiteLayout } from "@/components/SiteLayout";

const PickupGuide = () => {
  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-10">방문 수령시 안내</h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          내용을 입력하세요.
        </p>
      </section>
    </SiteLayout>
  );
};

export default PickupGuide;

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

const Aeroponics = () => {
  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-10">
        <p className="text-3xl font-sans font-semibold text-primary uppercase tracking-[0.25em] mb-3"></p>
        <h1 className="font-display md:text-6xl leading-tight mb-6 font-sans text-4xl">
          🌿 에어포트 (Air Pot) 재배 방식이란?
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          저희 자작나무는 일반 화분이 아닌 에어포트에서 재배됩니다. 에어포트란 옆면 전체에 통기 구멍이 있는 특수 용기로, 뿌리 품질을 근본적으로 높여주는 재배 방식입니다.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 md:px-10 pb-20">
        <div className="border-t border-border pt-12 grid gap-12 font-sans">
          <article>
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">✔ 뿌리 회전 완전 방지</h2>
            <p className="text-muted-foreground leading-relaxed">
              일반 화분에서는 뿌리가 벽에 닿으면 옆으로 감기며 엉킵니다. 에어포트에서는 뿌리 끝이 공기와 만나 자연 건조되면서 안쪽에서 새로운 잔뿌리가 계속 생성됩니다. 결과적으로 뿌리가 방사형의 촘촘한 구조로 발달합니다.
            </p>
          </article>

          <article>
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">✔ 잔뿌리 폭발적 증가</h2>
            <p className="text-muted-foreground leading-relaxed">
              식물 성장의 핵심은 굵은 뿌리가 아니라 잔뿌리(흡수근)입니다. 에어포트에서는 뿌리 끝이 지속적으로 분지되어 양분 흡수력과 수분 흡수력이 크게 향상됩니다.
            </p>
          </article>

          <article>
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">✔ 과습 & 뿌리썩음 예방</h2>
            <p className="text-muted-foreground leading-relaxed">
              옆면 전체가 통풍구 역할을 하여 배수와 증발이 동시에 이루어집니다. 물 고임으로 인한 산소 부족과 뿌리 부패 위험이 크게 줄어듭니다.
            </p>
          </article>

          <article>
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">✔ 토양 산소 공급 최적화</h2>
            <p className="text-muted-foreground leading-relaxed">
              네덜란드에서 조직배양한 잭큐몬티 도랜보스(Jacquemontii Doorenbos) 묘목을 들여와 동일한 환경에서
              관리하기 때문에, 수형과 수피 색이 일관된 고품질 자작나무를 공급할 수 있습니다.
            </p>
          </article>

          <article>
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">✔ 이식 스트레스 최소화</h2>
            <p className="text-muted-foreground leading-relaxed">
              에어포트에서 자란 나무는 잔뿌리가 풍부하고 뿌리 구조가 안정적이기 때문에, 이식 시에도 뿌리 손상이
              거의 없습니다. 식재 후 활착이 빠르고 고사율이 현저히 낮아 연중 어느 시기에도 안전하게 식재할 수 있습니다.
            </p>
          </article>

          <article>
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">✔ 균일하고 우수한 수형 형성</h2>
            <p className="text-muted-foreground leading-relaxed">
              건강한 뿌리 시스템은 지상부 생장에도 직접적인 영향을 미칩니다. 에어포트에서 재배된 자작나무는
              줄기와 가지가 균형 있게 발달하여, 조경 현장에서 바로 사용 가능한 일관된 수형과 품질을 보장합니다.
            </p>
          </article>

          <article>
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">✔ 이식 안정성 보장</h2>
            <p className="text-muted-foreground leading-relaxed">
              뿌리가 균일하게 퍼져 있어 이식 시에도 구조가 유지됩니다. 일반 화분처럼 감긴 뿌리를 풀다가 손상될 위험이 없어 고사율이 매우 낮습니다.
            </p>
          </article>

          <article>
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">✔ 빠르고 균일한 성장</h2>
            <p className="text-muted-foreground leading-relaxed">
              개체 간 편차가 줄어들고, 동일 조건에서 성장 속도가 더 빠릅니다. 뿌리 품질이 상품성으로 직결되는 조경수·자작나무 재배에 특히 적합한 방식입니다.
            </p>
          </article>

          <article>
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">✔ 이식 성공률 매우 높음</h2>
            <p className="text-muted-foreground leading-relaxed">
              에어포트 재배 나무는 일반 노지나 화분 재배 나무에 비해 식재 후 환경 적응력이 탁월합니다.
            </p>
          </article>

        </div>

        <div className="mt-16 flex flex-col items-end gap-16">
          <article className="w-full">
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">✔ 빠르고 균일한 성장</h2>
            <p className="text-muted-foreground leading-relaxed">
              {"\n"}
            </p>
          </article>

          <article className="w-full">
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">⚠️ 단점</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {"물이 빨리 마름 → 관수 관리 중요\n가격이 일반 화분보다 비쌈, 바람 강하면 건조 스트레스 가능"}
            </p>
          </article>

          <Button asChild size="lg" className="rounded-none">
            <Link to="/shop">
              구매하기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Aeroponics;

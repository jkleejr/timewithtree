import { SiteLayout } from "@/components/SiteLayout";

const Aeroponics = () => {
  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">재배 방식</p>
        <h1 className="font-display font-serif text-4xl md:text-6xl leading-tight mb-6">
          에어포닉스로 키운 자작나무
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          저희 농장은 흙 대신 에어포트(air-pot) 방식으로 자작나무를 재배합니다. 뿌리에 충분한 산소를 공급하고
          건강한 잔뿌리가 풍성하게 발달하도록 도와, 식재 후에도 안정적으로 활착하는 나무를 키워냅니다.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 md:px-10 pb-20">
        <div className="border-t border-border pt-12 grid gap-12">
          <article>
            <h2 className="font-display font-serif text-2xl md:text-3xl mb-3">연중 식재 가능</h2>
            <p className="text-muted-foreground leading-relaxed">
              에어포트로 재배된 나무는 뿌리가 손상되지 않은 상태로 옮겨지기 때문에, 봄·여름·가을·겨울 어느
              계절에도 식재가 가능합니다. 식재 시기에 구애받지 않고 조경 일정을 자유롭게 계획할 수 있습니다.
            </p>
          </article>

          <article>
            <h2 className="font-display font-serif text-2xl md:text-3xl mb-3">건강한 뿌리, 높은 활착률</h2>
            <p className="text-muted-foreground leading-relaxed">
              에어포트 특유의 구조는 뿌리가 공기에 닿으면 자연스럽게 가지를 치도록(air-pruning) 유도합니다.
              그 결과 굵은 직근 대신 잔뿌리가 촘촘히 발달해, 식재 후 고사 가능성이 현저히 낮아집니다.
            </p>
          </article>

          <article>
            <h2 className="font-display font-serif text-2xl md:text-3xl mb-3">깨끗하고 안정적인 운반</h2>
            <p className="text-muted-foreground leading-relaxed">
              흙이 거의 떨어지지 않는 구조라 운반 중 뿌리 충격이 최소화됩니다. 나무가 받는 스트레스를 줄여
              현장 도착 후 빠르게 새 환경에 적응할 수 있습니다.
            </p>
          </article>

          <article>
            <h2 className="font-display font-serif text-2xl md:text-3xl mb-3">균일한 품질</h2>
            <p className="text-muted-foreground leading-relaxed">
              네덜란드에서 조직배양한 잭큐몬티 도랜보스(Jacquemontii Doorenbos) 묘목을 들여와 동일한 환경에서
              관리하기 때문에, 수형과 수피 색이 일관된 고품질 자작나무를 공급할 수 있습니다.
            </p>
          </article>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Aeroponics;

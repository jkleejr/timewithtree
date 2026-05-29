import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, RotateCcw, Sprout, Droplets, Wind, ShieldCheck, TrendingUp, TreePine, type LucideIcon } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ShopBrowser } from "@/components/ShopBrowser";
import { Button } from "@/components/ui/button";
import heroMain1 from "@/assets/hero-main-1.jpg";
import heroMain3 from "@/assets/hero-main-3.jpg";
import heroBirch2 from "@/assets/hero-birch-2.png";
import heroBirch4 from "@/assets/hero-birch-4.png";
import heroBirch5 from "@/assets/hero-birch-5.png";
import airpotCloseup1 from "@/assets/airpot-closeup-1.jpg";
import airpotCloseup2 from "@/assets/airpot-closeup-2.jpg";
import treeMeasurements from "@/assets/tree-measurements.png";
import plantingMistakes from "@/assets/planting-mistakes.png";
import plantingCorrectVsWrong from "@/assets/planting-correct-vs-wrong.png";

const heroImages = [
  { src: heroMain1, alt: "Rows of Jacquemontii Doorenbos birch saplings growing in air-pots at the farm in summer" },
  { src: heroMain3, alt: "Mature Jacquemontii Doorenbos birch trees in air-pots at the farm" },
  { src: heroBirch2, alt: "Close-up of a multi-stem Jacquemontii birch and its papery white bark" },
  { src: heroBirch4, alt: "White birch trees on a manicured lawn with evergreen hedge" },
  { src: heroBirch5, alt: "Detailed close-up of Jacquemontii birch trunks with autumn foliage" },
];

const airpotBenefits = [
  { num: "01", title: "뿌리 회전 완전 방지", desc: "옆면 통기 구멍으로 뿌리 끝이 공기와 만나 자연 건조되면서 뺑뺑이 현상 없이 방사형으로 발달합니다." },
  { num: "02", title: "잔뿌리 폭발적 증가", desc: "뿌리 끝이 지속적으로 분지되어 양분·수분 흡수력이 크게 향상됩니다." },
  { num: "03", title: "과습 & 뿌리썩음 예방", desc: "옆면 전체가 통풍구 역할을 해 배수와 증발이 동시에 이루어집니다." },
  { num: "04", title: "토양 산소 공급", desc: "뿌리 호흡이 활발해져 건강한 뿌리 시스템을 형성합니다." },
  { num: "05", title: "이식 성공률 매우 높음", desc: "잔뿌리가 풍부해 식재 후 활착이 빠르고 고사율이 현저히 낮습니다." },
  { num: "06", title: "생육 속도 & 균일성 향상", desc: "개체 간 편차가 줄고 동일 조건에서 성장 속도가 빨라집니다." },
  { num: "07", title: "대형 수목 재배에 유리", desc: "뿌리 품질이 상품성으로 직결되는 조경수 재배에 특히 적합합니다." },
];

const plantingSteps = [
  { num: "1", text: "식재할 장소를 정리해줍니다." },
  { num: "2", text: "필요 이상으로 긴 가지나 뿌리는 정리해줍니다." },
  { num: "3", text: "뿌리분 뿌리보다 1.5배 크기로 구덩이를 팝니다." },
  { num: "4", text: "뿌리가 휘거나 구부러지지 않게 곧게 펴서 구덩이에 넣고 흙을 2/3 정도 채워줍니다." },
  { num: "5", text: "뿌리 사이에 흙이 잘 채워지도록 묘목을 흔들어 준 후 곧게 세워줍니다." },
  { num: "6", text: "나머지 흙으로 지면보다 약간 높게 흙을 덮어줍니다." },
  { num: "7", text: "식재 후 물을 충분히 주고 뿌리가 활착될 때까지 지속적으로 물 관리를 해줍니다." },
];

const Index = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const heroLen = heroImages.length;
  const location = useLocation();

  useEffect(() => {
    if (heroLen <= 1) return;
    const id = setInterval(() => setHeroIndex((i) => (i + 1) % heroLen), 10000);
    return () => clearInterval(id);
  }, [heroLen]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      // Defer to next tick so the section is mounted
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, [location.hash, location.key]);


  return (
    <SiteLayout>
      {/* Hero gallery */}
      <section className="relative">
        <div className="relative w-full overflow-hidden bg-secondary md:aspect-[16/8]">
          {heroImages.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.alt}
              width={1920}
              height={1280}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                i === heroIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {heroLen > 1 && (
            <>
              <button
                onClick={() => setHeroIndex((i) => (i - 1 + heroLen) % heroLen)}
                className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background p-1.5 rounded-full shadow z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setHeroIndex((i) => (i + 1) % heroLen)}
                className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background p-1.5 rounded-full shadow z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-2 w-2 rounded-full transition-all ${
                      i === heroIndex ? "bg-foreground w-6" : "bg-foreground/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute inset-0 bg-black/30 pointer-events-none" />

          {/* Intro overlay */}
          <div className="relative md:absolute md:inset-0 z-[5] max-w-7xl mx-auto px-12 sm:px-6 md:px-10 py-8 md:py-16 flex flex-col gap-4 sm:gap-6 md:gap-8 pointer-events-none min-h-full">
            <div className="pointer-events-auto flex flex-col gap-2 sm:gap-4 md:gap-6">
              <h1 className="font-display leading-tight font-bold font-sans text-white drop-shadow-lg text-4xl sm:text-4xl md:text-7xl">
                잭큐몬티 자작나무 농장
              </h1>
              <ul className="md:max-w-2xl space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-lg leading-relaxed font-sans text-white drop-shadow-md">
                <li className="flex gap-2"><span aria-hidden="true">-</span><span>네덜란드에서 조직배양한 묘목 재배</span></li>
                <li className="flex gap-2"><span aria-hidden="true">-</span><span>에어포트로 재배하여 연중 식재 가능, 식재 후 나무 고사 가능성 현저히 낮음</span></li>
              </ul>
            </div>
            <div className="pointer-events-auto mt-auto self-end">
              <Button
                asChild
                size="lg"
                className="rounded-none bg-black text-white hover:text-accent shadow-lg"
              >
                <Link to="/about">자작나무 소개</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 에어포트 재배 (inline, expanded) */}
      <section id="airpot" className="scroll-mt-24 border-t border-border bg-secondary/30 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="max-w-3xl mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Air-Pot Cultivation</p>
            <h2 className="font-display font-bold font-sans text-4xl md:text-5xl leading-tight mb-5">
              에어포트 재배
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-primary">
              저희 자작나무는 일반 화분이 아닌 <strong>에어포트(Air-Pot)</strong>에서 재배됩니다.
              옆면 전체에 통기 구멍이 있는 특수 용기로, 뿌리 품질을 근본적으로 높여주는 재배 방식입니다.
            </p>
          </div>

          {/* Air-pot close-up photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16">
            <figure className="overflow-hidden bg-background">
              <img
                src={airpotCloseup1}
                alt="에어포트 측면의 촘촘한 통기 구멍 클로즈업"
                loading="lazy"
                className="w-full aspect-[4/3] object-cover"
              />
              <figcaption className="px-4 py-3 text-xs md:text-sm text-muted-foreground font-sans">
                옆면 전체의 통기 구멍 — 뿌리 끝이 공기와 만나 잔뿌리가 폭발적으로 증가합니다.
              </figcaption>
            </figure>
            <figure className="overflow-hidden bg-background">
              <img
                src={airpotCloseup2}
                alt="에어포트에 식재된 자작나무 베이스 클로즈업"
                loading="lazy"
                className="w-full aspect-[4/3] object-cover"
              />
              <figcaption className="px-4 py-3 text-xs md:text-sm text-muted-foreground font-sans">
                에어포트에서 자란 자작나무 — 안정적인 뿌리 구조로 연중 식재가 가능합니다.
              </figcaption>
            </figure>
          </div>

          {/* Benefits — editorial list */}
          <div className="border-t border-border">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground pt-8 md:pt-10 mb-8 md:mb-10">
              Key Benefits
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-24">
              {airpotBenefits.map((b, i) => (
                <article
                  key={b.num}
                  className={`flex gap-6 md:gap-8 py-6 md:py-8 border-t border-border ${
                    i === 0 ? "md:border-t-0" : ""
                  } ${i === 1 ? "md:border-t-0" : ""}`}
                >
                  <span className="font-display text-3xl md:text-4xl font-bold text-accent/30 tabular-nums leading-none pt-1 w-12 md:w-14 flex-shrink-0">
                    {b.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-sans font-bold text-base md:text-lg text-foreground mb-2 leading-tight">
                      {b.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-primary">{b.desc}</p>
                  </div>
                </article>
              ))}
            </div>

            {/* Caveat — full-width banner, visually distinct */}
            <aside className="mt-10 md:mt-12 bg-background border border-border border-l-4 border-l-accent p-6 md:p-8 flex items-start gap-5 md:gap-6">
              <span aria-hidden="true" className="text-2xl md:text-3xl leading-none pt-0.5">⚠️</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 mb-2">
                  <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Caution
                  </p>
                  <h3 className="font-sans font-bold text-base md:text-lg text-foreground">단점</h3>
                </div>
                <p className="text-sm md:text-base leading-relaxed text-primary">
                  일반 화분보다 <span className="font-semibold text-foreground">물이 빨리 마르므로 관수 관리가 중요</span>합니다.
                  가격이 일반 화분보다 비싸며, 바람이 강한 환경에서는 건조 스트레스에 유의해야 합니다.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 나무 관련 정보 / 식재방법 (inline, expanded) */}
      <section id="info" className="scroll-mt-24 border-t border-border py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="max-w-3xl mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Planting Guide</p>
            <h2 className="font-display font-bold font-sans text-4xl md:text-5xl leading-tight mb-5">
              나무 관련 정보 · 식재방법
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-primary">
              에어포트에서 자란 자작나무는 연중 식재가 가능하며 활착이 매우 빠릅니다.
              아래의 식재 방법을 참고하여 건강하게 키워보세요.
            </p>
          </div>

          {/* Step cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border mb-16">
            {plantingSteps.map((s) => (
              <article key={s.num} className="bg-background p-5 md:p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl font-bold text-accent tabular-nums">
                    STEP {s.num}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-primary">{s.text}</p>
              </article>
            ))}
            <article className="bg-accent/10 p-5 md:p-6 flex flex-col gap-3">
              <span className="font-display text-2xl font-bold text-accent">🌿 멀칭</span>
              <p className="text-sm leading-relaxed text-primary">
                잡초 방지와 수분 증발을 막기 위해 제초매트, 부직포, 낙엽 또는 짚으로 잘 덮어줍니다.
              </p>
            </article>
          </div>

          {/* 묘목 식재 전 상식 */}
          <div className="mt-4 border-t border-border pt-12 md:pt-16">
            <div className="mb-8 md:mb-10">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Tree Measurements</p>
              <h3 className="font-display font-bold font-sans md:text-5xl leading-tight text-5xl">
                묘목 식재 전 상식
              </h3>
            </div>
            <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-stretch">
              <figure className="md:col-span-5 flex items-center justify-center">
                <img
                  src={treeMeasurements}
                  alt="수목 측정 기준 (H, W, R, B) 도식"
                  loading="lazy"
                  className="w-full max-w-[280px] h-auto"
                />
              </figure>
              <dl className="md:col-span-7 grid gap-px bg-border border border-border self-stretch content-start">
                {[
                  { k: "H", label: "수고", desc: "지면으로부터 수목의 맨 윗부분(상순의 끝)까지의 길이, 수목의 키.", unit: "m" },
                  { k: "W", label: "수관폭", desc: "가지의 끝과 반대쪽 가지의 끝까지의 너비.", unit: "m" },
                  { k: "R", label: "근원직경", desc: "줄기의 지면에 닿는 부분의 지름, 둘레를 π(3.14)로 나눈 값.", unit: "cm" },
                  { k: "B", label: "흉고직경", desc: "지면으로부터 1m20cm 높이의 줄기 지름, 둘레를 π(3.14)로 나눈 값.", unit: "cm" },
                ].map((item) => (
                  <div key={item.k} className="bg-background flex items-start gap-4 p-4 md:p-5">
                    <span className="font-display font-bold text-2xl md:text-3xl text-accent tabular-nums w-10 flex-shrink-0 leading-none pt-0.5">
                      {item.k}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-bold text-base md:text-lg text-foreground leading-tight mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm leading-relaxed text-primary font-sans">
                        {item.desc} <span className="text-muted-foreground">(단위 {item.unit})</span>
                      </p>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* 잘못된 식재 경고 */}
          <div className="mt-12 md:mt-16 border-t border-border pt-12 md:pt-16">
            <div className="mb-8 md:mb-10">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Common Mistakes</p>
              <h3 className="font-display font-bold font-sans md:text-4xl leading-tight text-5xl">
                잘못된 식재 예시
              </h3>
            </div>
            <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-start">
              <div className="md:col-span-5 grid gap-4">
                <figure>
                  <img src={plantingMistakes} alt="잘못된 식재 예시" loading="lazy" className="w-full h-auto" />
                </figure>
                <figure>
                  <img src={plantingCorrectVsWrong} alt="올바른 식재와 잘못된 식재 비교" loading="lazy" className="w-full h-auto" />
                </figure>
              </div>
              <ul className="md:col-span-7 grid gap-3 self-start">
                <li className="flex gap-4 p-4 md:p-5 bg-destructive/5 border-l-4 border-destructive">
                  <span className="font-display font-bold text-destructive text-lg leading-none pt-0.5">✕</span>
                  <p className="text-sm md:text-base leading-relaxed text-primary font-sans">묘목이 기울어져 있거나 뿌리가 뭉쳐있다</p>
                </li>
                <li className="flex gap-4 p-4 md:p-5 bg-destructive/5 border-l-4 border-destructive">
                  <span className="font-display font-bold text-destructive text-lg leading-none pt-0.5">✕</span>
                  <p className="text-sm md:text-base leading-relaxed text-primary font-sans">구덩이가 얕아서 뿌리가 밖으로 나온다</p>
                </li>
                <li className="flex gap-4 p-4 md:p-5 bg-accent/10 border-l-4 border-accent">
                  <span className="font-display font-bold text-accent text-lg leading-none pt-0.5">!</span>
                  <p className="text-sm md:text-base leading-relaxed text-primary font-sans">비탈진 경사면에 심을 때는 흙을 수평으로 하고 상단 경사면에 이어서 심지 않는다</p>
                </li>
                <li className="flex gap-4 p-4 md:p-5 bg-accent/10 border-l-4 border-accent">
                  <span className="font-display font-bold text-accent text-lg leading-none pt-0.5">!</span>
                  <p className="text-sm md:text-base leading-relaxed text-primary font-sans">
                    식재 시 비료나 완숙(가스 발생이 끝나지 않은) 거름을 넣고 심을 경우, 가스 발생으로 인한 흙·뿌리 밀어냄 현상이 일어나므로 주의 바랍니다. 뿌리 활착이 끝나더라도 첫해는 소량만 주는 것이 적절합니다.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Shop */}
      <section id="shop" className="border-t border-border pt-6 md:pt-10 pb-8 md:pb-12">
        <ShopBrowser showBackButton={false} title="구매하기" />
      </section>
    </SiteLayout>
  );
};

export default Index;

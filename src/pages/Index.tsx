import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ShopBrowser } from "@/components/ShopBrowser";
import { FarmGallery } from "@/components/FarmGallery";
import { Button } from "@/components/ui/button";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import heroMain1 from "@/assets/hero-main-1.jpg";
import heroMain2 from "@/assets/hero-main-2.jpg";
import heroMain3 from "@/assets/hero-main-3.jpg";
import heroBirch from "@/assets/hero-birch.jpg";
import heroBirch2 from "@/assets/hero-birch-2.png";
import heroBirch3 from "@/assets/hero-birch-3.jpg";
import heroBirch4 from "@/assets/hero-birch-4.png";
import heroBirch5 from "@/assets/hero-birch-5.png";
import farmIntro from "@/assets/farm-intro.jpg";
import farmJac1 from "@/assets/farm-jac-1.png";
import farmJac5 from "@/assets/farm-jac-5.png";
import farmJac13 from "@/assets/farm-jac-13.png";
import farmJac17 from "@/assets/farm-jac-17.png";
import farmJacBark from "@/assets/farm-jac-bark.jpg";
import airpot1 from "@/assets/airpot-1.jpg";
import airpot2 from "@/assets/airpot-2.jpg";
import airpot3 from "@/assets/airpot-3.jpg";
import airpot4 from "@/assets/airpot-4.jpg";

const airpotImages = [
  { src: airpot2, alt: "에어포트에서 자라는 자작나무 줄지어 선 모습" },
  { src: airpot1, alt: "에어포트에서 재배되는 자작나무 농장 전경" },
  { src: airpot3, alt: "에어포트에서 자라는 자작나무 통로 전경" },
  { src: airpot4, alt: "에어포트에서 재배되는 자작나무 줄지어 선 모습" },
];

const heroImages = [
  { src: heroMain1, alt: "Rows of Jacquemontii Doorenbos birch saplings growing in air-pots at the farm in summer" },
  { src: heroMain3, alt: "Mature Jacquemontii Doorenbos birch trees in air-pots at the farm" },
  
  { src: heroBirch2, alt: "Close-up of a multi-stem Jacquemontii birch and its papery white bark" },
  { src: heroBirch4, alt: "White birch trees on a manicured lawn with evergreen hedge" },
  { src: heroBirch5, alt: "Detailed close-up of Jacquemontii birch trunks with autumn foliage" },
];

const farmImages = [
  {
    src: farmIntro,
    alt: "Rows of Jacquemontii Doorenbos birch saplings growing in air-pots at the farm",
  },
  {
    src: farmJac5,
    alt: "Young Jacquemontii birch with bright white bark and green summer foliage",
  },
  {
    src: farmJac1,
    alt: "Multi-stem Jacquemontii birch with brilliant white trunks against red winter stems",
  },
  {
    src: farmJac13,
    alt: "Mature white-barked Jacquemontii birches planted in a landscaped lawn",
  },
  {
    src: farmJac17,
    alt: "Grove of Jacquemontii Doorenbos birch trunks in autumn",
  },
  {
    src: farmJacBark,
    alt: "Close-up of Jacquemontii Doorenbos birch trunk peeling its papery white bark",
  },
];

const Index = () => {
  const { data: products = [], isLoading } = useShopifyProducts(50);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroLen = heroImages.length;
  const [airpotIndex, setAirpotIndex] = useState(0);
  const airpotLen = airpotImages.length;

  useEffect(() => {
    if (heroLen <= 1) return;
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroLen);
    }, 10000);
    return () => clearInterval(id);
  }, [heroLen]);

  useEffect(() => {
    if (airpotLen <= 1) return;
    const id = setInterval(() => {
      setAirpotIndex((i) => (i + 1) % airpotLen);
    }, 10000);
    return () => clearInterval(id);
  }, [airpotLen]);

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
              <h1 className="font-display leading-tight font-bold font-sans text-white drop-shadow-lg">
                <span className="block text-2xl sm:text-4xl md:text-7xl">잭큐몬티 도랜보스</span>
                <span className="block text-xl sm:text-3xl md:text-6xl">Jacquemontii Doorenbos</span>
                <span className="block text-xl sm:text-3xl md:text-6xl">자작나무 농장</span>
              </h1>
              <ul className="md:max-w-2xl space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-lg leading-relaxed font-sans text-white drop-shadow-md">
                <li className="flex gap-2"><span aria-hidden="true">-</span><span>네델란드 조직배양한 묘목 수입하여 재배</span></li>
                <li className="flex gap-2"><span aria-hidden="true">-</span><span>에어포트로 재배하여 연중 식재 가능, 식재 후 나무 고사 가능성 현저히 낮음</span></li>
              </ul>
            </div>
            <div className="mt-auto pb-8 md:pb-0 flex justify-end pointer-events-auto">
              <Button asChild size="lg" className="rounded-none">
                <Link to="/about">
                  잭큐몬티 도랜보스 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Planting */}
      <section className="border-t border-border py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10 flex flex-col gap-6 sm:gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">​</p>
            <h2 className="font-display leading-tight font-bold font-sans text-5xl sm:text-5xl md:text-5xl">
              식재방법
            </h2>
          </div>
          <p className="md:max-w-2xl text-base md:text-lg leading-relaxed font-sans text-primary">
            에어포트에서 자란 자작나무는 연중 식재가 가능하며 활착이 매우 빠릅니다. 올바른 식재 절차와 사후 관리 방법을 안내해 드립니다.
          </p>
          <div className="flex justify-end">
            <Button asChild size="lg" className="rounded-none">
              <Link to="/planting">
                식재방법 자세히 보기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="relative">
        <div className="relative w-full overflow-hidden bg-secondary md:aspect-[16/8]">
          {airpotImages.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.alt}
              width={1920}
              height={1280}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                i === airpotIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-black/30" />

          {airpotLen > 1 && (
            <>
              <button
                onClick={() => setAirpotIndex((i) => (i - 1 + airpotLen) % airpotLen)}
                className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background p-1.5 rounded-full shadow z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setAirpotIndex((i) => (i + 1) % airpotLen)}
                className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background p-1.5 rounded-full shadow z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {airpotImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setAirpotIndex(i)}
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-2 w-2 rounded-full transition-all ${
                      i === airpotIndex ? "bg-white w-6" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="relative z-[5] max-w-7xl mx-auto px-12 sm:px-6 md:px-10 py-6 sm:py-10 md:py-12 h-full flex flex-col gap-3 sm:gap-4 md:gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/80 mb-2">​</p>
              <h2 className="font-display leading-tight font-bold font-sans text-white drop-shadow-lg text-2xl sm:text-3xl md:text-5xl">
                에어포트 재배의 장점
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4 flex-1 min-h-0">
              <ul className="md:max-w-2xl leading-snug text-xs sm:text-sm md:text-base text-white drop-shadow-md space-y-1">
                <li>1️⃣ 뿌리 회전 (뺑뺑이) 완전 방지</li>
                <li>2️⃣ 잔뿌리 폭발적으로 증가</li>
                <li>3️⃣ 과습 & 뿌리썩음 예방</li>
                <li>4️⃣ 토양 산소 공급 (이게 진짜 핵심)</li>
                <li>5️⃣ 이식(정식) 성공률 매우 높음</li>
                <li>6️⃣ 생육 속도 & 균일성 향상</li>
                <li>7️⃣ 대형 수목 재배에 특히 유리</li>
              </ul>
              <div className="mt-auto pb-8 md:pb-0 flex justify-end">
                <Button asChild size="lg" className="rounded-none">
                  <Link to="/aeroponics">
                    에어포트​ 설명 <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop */}
      <section className="border-t border-border pt-6 md:pt-10 pb-8 md:pb-12">
        <ShopBrowser showBackButton={false} />
      </section>
    </SiteLayout>
  );
};

const EmptyProducts = () => (
  <div className="border border-dashed border-border py-20 text-center">
    <p className="font-display text-2xl mb-2 font-sans">No products found</p>
    <p className="text-muted-foreground text-sm">Add your first birch tree to get started.</p>
  </div>
);

export default Index;

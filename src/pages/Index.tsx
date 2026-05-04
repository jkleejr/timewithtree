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

  useEffect(() => {
    if (heroLen <= 1) return;
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroLen);
    }, 10000);
    return () => clearInterval(id);
  }, [heroLen]);

  return (
    <SiteLayout>
      {/* Hero gallery */}
      <section className="relative">
        <div className="relative aspect-[16/10] md:aspect-[16/8] w-full overflow-hidden bg-secondary">
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
              <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
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

          {/* Intro card overlay on the bottom right */}
          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 max-w-xs md:max-w-sm bg-white/75 backdrop-blur-md text-black p-4 md:p-5 shadow-xl font-sans">
            <p className="font-semibold text-sm leading-snug mb-2 font-sans md:text-2xl">
              잭큐몬티 도랜보스 (Jacquemontii Doorenbos) 자작나무 농장
            </p>
            <ul className="space-y-1 text-xs md:text-sm leading-relaxed font-sans">
              <li className="flex gap-2"><span aria-hidden="true">-</span><span>네델란드 조직배양한 묘목 수입하여 재배</span></li>
              <li className="flex gap-2"><span aria-hidden="true">-</span><span>에어포트로 재배하여 연중 식재 가능, 식재 후 나무 고사 가능성 현저히 낮음</span></li>
            </ul>
            <div className="mt-4 flex justify-end">
              <Button asChild size="sm" className="rounded-none">
                <Link to="/about">
                  잭큐몬티 도랜보스 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Shop */}
      <section className="border-t border-border py-16 md:py-24">
        <ShopBrowser />
      </section>

      {/* Story */}
      <section>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">에어포트</p>
            <h2 className="font-display text-3xl md:text-5xl leading-tight font-bold font-sans">
              에어포트 재배의 장점
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 flex flex-col gap-6">
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-primary">
              <p className="mb-4">
                <span className="font-bold text-foreground">1️⃣ 뿌리 회전(뺑뺑이) 완전 방지</span>{"\n"}
                일반 화분: 뿌리가 벽에 닿으면 옆으로 돌면서 계속 감기고, 결국 뿌리 엉킴과 생육 저하가 발생합니다.{"\n"}
                에어 포트: 뿌리가 공기와 만나 끝이 자연 건조(air pruning)되면서, 안쪽에서 새로운 잔뿌리가 계속 생성됩니다.{"\n"}
                👉 <span className="font-medium">결과: 방사형의 촘촘한 뿌리 구조 형성</span>
              </p>
              <p>
                <span className="font-bold text-foreground">2️⃣ 잔뿌리 폭발적으로 증가</span>{"\n"}
                식물 성장의 핵심인 잔뿌리가 에어 포트에서는 계속 분지되어 양분과 수분 흡수력이 극대화됩니다.{"\n"}
                👉 <span className="font-medium">결과: 활착 속도 증가 및 건강한 생육</span>
              </p>
            </div>
            <div className="flex justify-end">
              <Button asChild size="lg" className="rounded-none">
                <Link to="/aeroponics">
                  에어포트​ 설명 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

const EmptyProducts = () => (
  <div className="border border-dashed border-border py-20 text-center">
    <p className="font-display text-2xl mb-2">No products found</p>
    <p className="text-muted-foreground text-sm">Add your first birch tree to get started.</p>
  </div>
);

export default Index;

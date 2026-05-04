import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ShopBrowser } from "@/components/ShopBrowser";
import { FarmGallery } from "@/components/FarmGallery";
import { Button } from "@/components/ui/button";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import heroBirch from "@/assets/hero-birch.jpg";
import heroBirch2 from "@/assets/hero-birch-2.png";
import farmIntro from "@/assets/farm-intro.jpg";
import farmJac1 from "@/assets/farm-jac-1.png";
import farmJac5 from "@/assets/farm-jac-5.png";
import farmJac13 from "@/assets/farm-jac-13.png";
import farmJac17 from "@/assets/farm-jac-17.png";
import farmJacBark from "@/assets/farm-jac-bark.jpg";

const heroImages = [
  { src: heroBirch, alt: "A grove of Korean white birch trees in soft morning light" },
  { src: heroBirch2, alt: "Close-up of a multi-stem Jacquemontii birch and its papery white bark" },
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

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative">
        <div className="aspect-[16/10] md:aspect-[16/8] w-full overflow-hidden">
          <img
            src={heroBirch}
            alt="A grove of Korean white birch trees in soft morning light"
            width={1920}
            height={1280}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Farm intro */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6">
            <FarmGallery images={farmImages} />
          </div>
          <div className="md:col-span-6 md:-mt-16">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
              나무 소개
            </p>
            <h2 className="font-display md:text-4xl lg:text-5xl leading-tight mb-8 font-serif text-5xl font-bold">
              잭큐몬티 도랜보스 자작나무 농장
            </h2>
            <ul className="space-y-4 text-base md:text-lg leading-relaxed font-serif text-primary">
              <li className="text-lg flex gap-2"><span aria-hidden="true">-</span><span>잭큐몬티 도랜보스 (Jacquemontii Doorenbos) 자작나무 농장</span></li>
              <li className="text-lg flex gap-2"><span aria-hidden="true">-</span><span>네델란드 조직배양한 묘목 수입하여 재배</span></li>
              <li className="text-lg flex gap-2"><span aria-hidden="true">-</span><span>에어포트로 재배하여 연중 식재 가능, 식재 후 나무 고사 가능성 현저히 낮음</span></li>
            </ul>
            <div className="mt-10 flex justify-end">
              <Button asChild size="lg" className="rounded-none">
                <Link to="/about">
                  나무 소개 <ArrowRight className="ml-2 h-4 w-4" />
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
            <h2 className="font-display text-3xl md:text-5xl leading-tight font-serif font-bold">
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
                  에어포닉스 설명 <ArrowRight className="ml-2 h-4 w-4" />
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

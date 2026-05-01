import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { FarmGallery } from "@/components/FarmGallery";
import { Button } from "@/components/ui/button";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import heroBirch from "@/assets/hero-birch.jpg";
import farmIntro from "@/assets/farm-intro.jpg";
import farmJac1 from "@/assets/farm-jac-1.png";
import farmJac5 from "@/assets/farm-jac-5.png";
import farmJac13 from "@/assets/farm-jac-13.png";
import farmJac17 from "@/assets/farm-jac-17.png";

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
          <div className="md:col-span-6">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
              자작나무 소개
            </p>
            <h2 className="font-display md:text-4xl lg:text-5xl leading-tight mb-8 font-serif text-5xl font-bold">
              잭큐몬티 도랜보스 자작나무 농장
            </h2>
            <ul className="space-y-4 text-base md:text-lg leading-relaxed text-muted-foreground list-disc pl-6 marker:text-accent">
              <li>잭큐몬티 도랜보스 (Jacquemontii Doorenbos) 자작나무 농장</li>
              <li>네델란드 조직배양한 묘목 수입하여 재배</li>
              <li>에어포트로 재배하여 연중 식재 가능, 식재 후 나무 고사 가능성 현저히 낮음</li>
            </ul>
            <div className="mt-10 flex justify-end">
              <Button asChild size="lg" className="rounded-none">
                <Link to="/about">
                  자작나무 소개 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">쇼핑</p>
            <h2 className="font-display md:text-4xl font-serif font-extrabold text-5xl">자작나무 주문</h2>
          </div>
          <Link to="/shop" className="text-sm hover:text-accent transition-colors hidden md:inline-flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-secondary mb-4" />
                <div className="h-4 bg-secondary w-2/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyProducts />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
            {products.map(p => <ProductCard key={p.node.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Story */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">잭큐몬티 도랜보스</p>
            <h2 className="font-display text-3xl md:text-5xl leading-tight">
              Trees raised slowly, in the highlands of Korea.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 flex flex-col gap-6">
            <p className="text-muted-foreground leading-relaxed">
              For three generations, our family nursery has cultivated Betula platyphylla — the Korean white birch —
              prized for its smooth white bark and soft, papery leaves that turn golden in autumn.
            </p>
            <Link to="/aeroponics" className="inline-flex items-center gap-2 text-sm hover:text-accent transition-colors">
              Read more <ArrowRight className="h-4 w-4" />
            </Link>
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

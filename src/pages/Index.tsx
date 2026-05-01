import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import heroBirch from "@/assets/hero-birch.jpg";

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
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
              From the nurseries of Korea
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-3xl">
              Quiet, slender, and luminous — the Korean white birch.
            </h1>
          </div>
          <div className="md:col-span-4 flex md:justify-end">
            <Button asChild size="lg" className="rounded-none">
              <Link to="/shop">
                Shop trees <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Featured</p>
            <h2 className="font-display text-3xl md:text-4xl">Selected trees</h2>
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
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Our story</p>
            <h2 className="font-display text-3xl md:text-5xl leading-tight">
              Trees raised slowly, in the highlands of Korea.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 flex flex-col gap-6">
            <p className="text-muted-foreground leading-relaxed">
              For three generations, our family nursery has cultivated Betula platyphylla — the Korean white birch —
              prized for its smooth white bark and soft, papery leaves that turn golden in autumn.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-sm hover:text-accent transition-colors">
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

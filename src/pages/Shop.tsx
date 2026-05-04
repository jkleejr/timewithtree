import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductListRow } from "@/components/ProductListRow";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SortKey = 'newest' | 'price-asc' | 'price-desc';

const Shop = () => {
  const { data: products = [], isLoading } = useShopifyProducts(50);
  const [sort, setSort] = useState<SortKey>('newest');

  const sorted = useMemo(() => {
    const arr = [...products];
    if (sort === 'price-asc') arr.sort((a, b) => parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount));
    if (sort === 'price-desc') arr.sort((a, b) => parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount));
    return arr;
  }, [products, sort]);

  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3"></p>
        <h1 className="font-display text-4xl md:text-5xl mb-6 font-serif font-bold">나무 주문</h1>
        <div className="flex items-center justify-between border-t border-border pt-6">
          <span className="text-sm text-muted-foreground">{sorted.length}개</span>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-[180px] rounded-none">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-secondary mb-4" />
                <div className="h-4 bg-secondary w-2/3" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="border border-dashed border-border py-20 text-center">
            <p className="font-display text-2xl mb-2">No products found</p>
            <p className="text-muted-foreground text-sm">Add your first birch tree to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
            {sorted.map(p => <ProductCard key={p.node.id} product={p} />)}
          </div>
        )}
      </section>
    </SiteLayout>
  );
};

export default Shop;

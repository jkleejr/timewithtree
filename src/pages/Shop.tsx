import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";

type SortKey = "newest" | "price-asc" | "price-desc";

const Shop = () => {
  const { data: products = [], isLoading } = useShopifyProducts(50);
  const [sort, setSort] = useState<SortKey>("newest");
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const addItem = useCartStore((s) => s.addItem);
  const isAdding = useCartStore((s) => s.isLoading);

  const sorted = useMemo(() => {
    const arr = [...products];
    if (sort === "price-asc")
      arr.sort(
        (a, b) =>
          parseFloat(a.node.priceRange.minVariantPrice.amount) -
          parseFloat(b.node.priceRange.minVariantPrice.amount),
      );
    if (sort === "price-desc")
      arr.sort(
        (a, b) =>
          parseFloat(b.node.priceRange.minVariantPrice.amount) -
          parseFloat(a.node.priceRange.minVariantPrice.amount),
      );
    return arr;
  }, [products, sort]);

  const activeProduct =
    sorted.find((p) => p.node.id === activeProductId) ?? sorted[0];
  const images = activeProduct?.node.images.edges ?? [];
  const variants = activeProduct?.node.variants.edges ?? [];

  const selectProduct = (id: string) => {
    setActiveProductId(id);
    setActiveImage(0);
  };

  const getQty = (id: string) => quantities[id] ?? 1;
  const setQty = (id: string, q: number) =>
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, q) }));

  const handleAdd = async (variantIndex: number) => {
    if (!activeProduct) return;
    const variant = variants[variantIndex]?.node;
    if (!variant) return;
    await addItem({
      product: activeProduct,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: getQty(variant.id),
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("장바구니에 담았습니다", {
      description: `${activeProduct.node.title} — ${variant.title}`,
      position: "top-center",
    });
  };

  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-8">
        <h1 className="font-display text-4xl md:text-5xl mb-6 font-serif font-bold">
          나무 주문
        </h1>
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
          <div className="grid md:grid-cols-2 gap-10">
            <div className="aspect-[4/5] bg-secondary animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 bg-secondary animate-pulse" />
              ))}
            </div>
          </div>
        ) : sorted.length === 0 ? (
          <div className="border border-dashed border-border py-20 text-center">
            <p className="font-display text-2xl mb-2">No products found</p>
            <p className="text-muted-foreground text-sm">
              Add your first birch tree to get started.
            </p>
          </div>
        ) : activeProduct ? (
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: image gallery for active product */}
            <div className="md:sticky md:top-24 self-start">
              <div className="relative aspect-[4/5] bg-secondary overflow-hidden mb-3">
                {images[activeImage] ? (
                  <img
                    src={images[activeImage].node.url}
                    alt={images[activeImage].node.altText || activeProduct.node.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    No image
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImage((i) => (i - 1 + images.length) % images.length)
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.slice(0, 5).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`aspect-square overflow-hidden border ${
                        i === activeImage ? "border-foreground" : "border-transparent"
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
              <Link
                to={`/product/${activeProduct.node.handle}`}
                className="inline-block mt-4 text-sm underline text-muted-foreground hover:text-foreground"
              >
                상세 페이지 보기 →
              </Link>
            </div>

            {/* Right: scrollable list of all products with their variants */}
            <div className="space-y-8">
              {sorted.map((product) => {
                const p = product.node;
                const isActive = p.id === activeProduct.node.id;
                const thumb = p.images.edges[0]?.node;
                return (
                  <div
                    key={p.id}
                    className={`border ${
                      isActive ? "border-foreground" : "border-border"
                    } p-4 transition-colors`}
                  >
                    <button
                      onClick={() => selectProduct(p.id)}
                      className="w-full flex items-center gap-3 text-left mb-3"
                    >
                      <div className="w-12 h-12 bg-secondary overflow-hidden flex-shrink-0">
                        {thumb && (
                          <img
                            src={thumb.url}
                            alt={p.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-serif font-bold text-lg leading-tight truncate">
                          {p.title}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          총 {p.variants.edges.length}개의 옵션
                        </p>
                      </div>
                    </button>

                    {isActive && (
                      <ul className="divide-y divide-border border-y border-border">
                        {variants.map((v, i) => {
                          const variant = v.node;
                          const qty = getQty(variant.id);
                          return (
                            <li
                              key={variant.id}
                              className="flex items-center gap-3 py-3"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {variant.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  예상출고시기:{" "}
                                  <span className="text-foreground">즉시배송 가능</span>
                                </p>
                              </div>
                              <span className="text-sm tabular-nums font-semibold whitespace-nowrap">
                                {variant.price.currencyCode}{" "}
                                {parseFloat(variant.price.amount).toFixed(2)}
                              </span>
                              <div className="inline-flex items-center border border-border">
                                <button
                                  onClick={() => setQty(variant.id, qty - 1)}
                                  className="px-2 py-1.5 hover:bg-secondary"
                                  aria-label="Decrease"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center text-sm tabular-nums">
                                  {qty}
                                </span>
                                <button
                                  onClick={() => setQty(variant.id, qty + 1)}
                                  className="px-2 py-1.5 hover:bg-secondary"
                                  aria-label="Increase"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <Button
                                size="icon"
                                variant="outline"
                                className="rounded-none h-9 w-9"
                                onClick={() => handleAdd(i)}
                                disabled={isAdding || !variant.availableForSale}
                                aria-label="Add to cart"
                              >
                                {isAdding ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <ShoppingCart className="h-4 w-4" />
                                )}
                              </Button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground">
                ⓘ 생물 특성상 실제 받아보시는 상품과 다소(계절별) 차이가 날 수 있습니다.
              </p>
            </div>
          </div>
        ) : null}
      </section>
    </SiteLayout>
  );
};

export default Shop;

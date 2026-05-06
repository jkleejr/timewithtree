import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Loader2, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { formatPrice } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/BackButton";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type SortKey = "newest" | "price-asc" | "price-desc";

interface ShopBrowserProps {
  showHeader?: boolean;
  title?: string;
  showBackButton?: boolean;
}

export const ShopBrowser = ({ showHeader = true, title = "구매하기", showBackButton = true }: ShopBrowserProps) => {
  const { data: products = [], isLoading } = useShopifyProducts(50);
  const [sort, setSort] = useState<SortKey>("newest");
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [pendingAdd, setPendingAdd] = useState<{
    product: ShopifyProduct;
    variantId: string;
  } | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const isAdding = useCartStore((s) => s.isLoading);
  const cartItems = useCartStore((s) => s.items);
  const cartQtyByVariant = useMemo(() => {
    const map: Record<string, number> = {};
    for (const it of cartItems) map[it.variantId] = (map[it.variantId] ?? 0) + it.quantity;
    return map;
  }, [cartItems]);

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

  const getQty = (id: string) => quantities[id] ?? 0;
  const setQty = (id: string, q: number) =>
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, q) }));

  const handleAddVariant = async (
    product: typeof sorted[number],
    variantId: string,
  ) => {
    const variant = product.node.variants.edges.find((v) => v.node.id === variantId)?.node;
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: getQty(variant.id),
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("장바구니에 담았습니다", {
      description: `${product.node.title} — ${variant.title}`,
      position: "top-center",
    });
  };

  return (
    <>
      {showHeader && (
        <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10 pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8">
          <h1 className="font-display mb-6 font-bold font-sans text-4xl sm:text-5xl">
            {title}
          </h1>
          <div className="flex items-center justify-between border-t border-border pt-6">
            <span className="text-sm text-muted-foreground" />
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
        </div>
      )}

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10 pb-8">
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
            <div className="md:sticky md:top-24 self-start">
              <h2 className="font-display font-bold mb-4 font-sans text-2xl sm:text-3xl md:text-3xl">
                {activeProduct.node.title}
              </h2>
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
              {(activeProduct.node.descriptionHtml || activeProduct.node.description) && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-bold mb-3 font-sans text-lg">
                    {activeProduct.node.title}
                  </h3>
                  {activeProduct.node.descriptionHtml ? (
                    <div
                      className="leading-relaxed space-y-3 text-foreground font-sans text-lg"
                      dangerouslySetInnerHTML={{ __html: activeProduct.node.descriptionHtml }}
                    />
                  ) : (
                    <p className="leading-relaxed whitespace-pre-line text-foreground font-sans text-lg">
                      {activeProduct.node.description}
                    </p>
                  )}
                </div>
              )}
              {showBackButton && (
                <div className="mt-16">
                  <BackButton />
                </div>
              )}
            </div>

            <div className="md:pt-14">
              <h2 className="font-display font-bold mb-4 font-sans text-2xl sm:text-3xl md:text-3xl">
                잭큐몬티 자작나무
              </h2>
              <div className="border border-border">
                <ul className="divide-y divide-border">
                  {sorted.flatMap((product) => {
                    const p = product.node;
                    const isActive = p.id === activeProduct.node.id;
                    const thumb = p.images.edges[0]?.node;
                    return p.variants.edges.map((v, vi) => {
                      const variant = v.node;
                      const qty = getQty(variant.id);
                      const inCart = cartQtyByVariant[variant.id] ?? 0;
                      return (
                        <li
                          key={variant.id}
                          className={`flex flex-wrap sm:flex-nowrap items-center gap-x-3 gap-y-3 px-3 sm:px-4 py-3 cursor-pointer transition-colors ${
                            isActive ? "bg-secondary/40" : "hover:bg-secondary/20"
                          }`}
                          onClick={() => selectProduct(p.id)}
                        >
                          {vi === 0 ? (
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
                          ) : (
                            <div className="w-12 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            {vi === 0 && (
                              <p className="font-bold leading-tight truncate font-sans text-sm sm:text-base">
                                {p.title}
                              </p>
                            )}
                            {variant.title !== "Default Title" && (
                              <p className="text-sm font-medium truncate">
                                {variant.title}
                              </p>
                            )}
                            <p className="text-primary text-xs sm:text-sm">
                              예상출고시기:{" "}
                              <span className="text-foreground">즉시배송 가능</span>
                            </p>
                          </div>
                          <span className="text-sm tabular-nums font-semibold whitespace-nowrap ml-auto sm:ml-0">
                            {formatPrice(variant.price.amount, variant.price.currencyCode)}
                          </span>
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <div
                              className="inline-flex items-center border border-border"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => setQty(variant.id, qty - 1)}
                                className="px-2 py-1.5 hover:bg-secondary"
                                aria-label="Decrease"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={qty}
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                                onChange={(e) => {
                                  const v = parseInt(e.target.value, 10);
                                  if (isNaN(v)) return setQty(variant.id, 0);
                                  setQty(variant.id, Math.min(100, Math.max(0, v)));
                                }}
                                className="w-10 text-center text-sm tabular-nums bg-transparent border-0 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                aria-label="Quantity"
                              />
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
                              className="rounded-none h-9 w-9 relative flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPendingAdd({ product, variantId: variant.id });
                              }}
                              disabled={isAdding || qty < 1 || !variant.availableForSale}
                              aria-label="Add to cart"
                            >
                              {isAdding ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <ShoppingCart className="h-4 w-4" />
                              )}
                              {inCart > 0 && (
                                <span className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] font-semibold rounded-full h-5 min-w-5 px-1 flex items-center justify-center tabular-nums">
                                  {inCart}
                                </span>
                              )}
                            </Button>
                          </div>
                        </li>
                      );
                    });
                  })}
                </ul>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                ⓘ 생물 특성상 실제 받아보시는 상품과 다소(계절별) 차이가 날 수 있습니다.
              </p>
              <div className="flex justify-end mt-6">
                <Button asChild size="lg" className="rounded-none">
                  <Link to="/cart">
                    장바구니 <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <AlertDialog open={!!pendingAdd} onOpenChange={(o) => !o && setPendingAdd(null)}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>용달 배송안내</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm leading-relaxed">
                <p>
                  본 상품은 일반 택배로 배송이 불가하며, <strong>용달(화물차)</strong>로
                  배송됩니다. 그래도 주문하시겠습니까?
                </p>
                <p>
                  용달 배송비는 별도로 청구되며, 정확한 금액은 사무실로 직접
                  문의해 주시기 바랍니다.
                </p>
                <p className="text-xs text-muted-foreground">
                  (용달은 일반 택배가 아닌 화물차 배송 서비스를 의미합니다)
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">취소</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                if (pendingAdd) {
                  handleAddVariant(pendingAdd.product, pendingAdd.variantId);
                  setPendingAdd(null);
                }
              }}
            >
              장바구니에 담기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

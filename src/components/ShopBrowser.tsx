import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Loader2, ChevronLeft, ChevronRight, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { formatPrice } from "@/lib/utils";


import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/BackButton";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/data/products";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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


interface ShopBrowserProps {
  showHeader?: boolean;
  title?: string;
  showBackButton?: boolean;
}

export const ShopBrowser = ({ showHeader = true, title = "잭큐몬티 자작나무", showBackButton = true }: ShopBrowserProps) => {
  const { data: products = [], isLoading } = useShopifyProducts(50);
  const [searchParams] = useSearchParams();
  const productParam = searchParams.get("product");
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [pendingAdd, setPendingAdd] = useState<{
    product: ShopifyProduct;
    variantId: string;
  } | null>(null);


  useEffect(() => {
    if (!productParam || products.length === 0) return;
    const match = products.find((p) => p.node.handle === productParam);
    if (match) {
      setActiveProductId(match.node.id);
      setActiveVariantId(match.node.variants.edges[0]?.node.id ?? null);
      setActiveImage(0);
    }
  }, [productParam, products]);

  // Preload all variant images so switching variants is instant
  useEffect(() => {
    if (products.length === 0) return;
    const urls = new Set<string>();
    for (const p of products) {
      for (const e of p.node.images.edges) urls.add(e.node.url);
      if (p.node.variantImages) {
        for (const arr of Object.values(p.node.variantImages)) {
          for (const e of arr) urls.add(e.node.url);
        }
      }
    }
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [products]);

  const addItem = useCartStore((s) => s.addItem);
  const isAdding = useCartStore((s) => s.isLoading);
  const cartItems = useCartStore((s) => s.items);
  const cartQtyByVariant = useMemo(() => {
    const map: Record<string, number> = {};
    for (const it of cartItems) map[it.variantId] = (map[it.variantId] ?? 0) + it.quantity;
    return map;
  }, [cartItems]);
  const sorted = products;

  const activeProduct =
    sorted.find((p) => p.node.id === activeProductId) ?? sorted[0];
  const variants = activeProduct?.node.variants.edges ?? [];
  const activeVariant = variants.find((v) => v.node.id === activeVariantId)?.node ?? variants[0]?.node;
  const images =
    (activeProduct && activeVariant?.title
      ? activeProduct.node.variantImages?.[activeVariant.title]
      : undefined) ?? activeProduct?.node.images.edges ?? [];

  const selectProduct = (id: string, variantId?: string) => {
    const selectedProduct = sorted.find((p) => p.node.id === id);
    setActiveProductId(id);
    setActiveVariantId(variantId ?? selectedProduct?.node.variants.edges[0]?.node.id ?? null);
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
    const variantLabel = variant.title && variant.title !== "Default Title" ? ` — ${variant.title}` : "";
    toast.success("장바구니에 담았습니다", {
      description: `${product.node.title}${variantLabel} × ${getQty(variant.id)}`,
      position: "top-center",
    });
  };

  return (
    <>
      {showHeader && (
        <div className="max-w-7xl mx-auto px-12 sm:px-6 md:px-10 pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8">
          <h1 className="font-display mb-6 font-bold font-sans text-4xl sm:text-5xl">
            {title}
          </h1>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-12 sm:px-6 md:px-10 pb-8">
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
            <p className="font-display text-2xl mb-2 font-sans">No products found</p>
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
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="block w-full h-full cursor-zoom-in"
                    aria-label="사진 확대 보기"
                  >
                    <img
                      src={images[activeImage].node.url}
                      alt={images[activeImage].node.altText || activeProduct.node.title}
                      className="w-full h-full object-cover"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </button>
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
                      onClick={() => {
                        setActiveImage(i);
                        setLightboxOpen(true);
                      }}
                      className={`aspect-square overflow-hidden border ${
                        i === activeImage ? "border-foreground" : "border-transparent"
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt=""
                        className="w-full h-full object-cover"
                        decoding="async"
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
                      className="leading-relaxed space-y-3 text-foreground font-sans text-base md:text-lg"
                      dangerouslySetInnerHTML={{ __html: activeProduct.node.descriptionHtml }}
                    />
                  ) : (
                    <p className="leading-relaxed whitespace-pre-line text-foreground font-sans text-base md:text-lg">
                      {activeProduct.node.description}
                    </p>
                  )}
                </div>
              )}
              <Accordion type="single" collapsible className="mt-8 font-sans font-bold">
                <AccordionItem value="shipping">
                  <AccordionTrigger>나무 배송 안내</AccordionTrigger>
                  <AccordionContent className="font-sans font-normal text-foreground">
                    <div className="space-y-4 text-sm md:text-base leading-relaxed">
                      <p>
                        〮 나무는 에어포트에 식재된 상태로 배송됩니다.<br />
                        <span className="block pl-3">식재시 반드시 에어포트 몸통과 하단 받침대를 분리 후 나무만 식재하세요.</span>
                      </p>
                      <div>
                        <p>〮 용달 배송 안내</p>
                        <ul className="mt-2 pl-5 space-y-2 list-disc">
                          <li>
                            본 상품은 일반 택배로 배송이 불가하며, 용달(화물차)로만 배송됩니다.
                            <br />
                            <span className="text-muted-foreground">(용달은 일반 택배가 아닌 화물차 배송 서비스를 의미합니다)</span>
                          </li>
                          <li>
                            용달 배송비는 상품 금액과 별도로 청구되며, 용달 배송비는 용달(화물차)에 직접 지불하시면 됩니다.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="origin">
                  <AccordionTrigger>원산지</AccordionTrigger>
                  <AccordionContent className="font-sans font-normal text-foreground">
                    네덜란드에서 조직배양한 묘목을 국내에서 재배
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pickup">
                  <AccordionTrigger>방문 구입 또는 직접 나무 수령시 안내</AccordionTrigger>
                  <AccordionContent className="font-sans font-normal text-foreground">
                    <div className="space-y-4 text-sm md:text-base leading-relaxed">
                      <p>
                        저희 나무와 걷는 시간 농장은 세종시 장군면 송문리와 공주시 정안면 대산리의 2개 지역에 농장이 있습니다.
                      </p>
                      <ul className="pl-5 space-y-3 list-disc">
                        <li>
                          농장 방문을 통해 구입을 원하시거나 온라인 주문 후 직접 나무를 가져가실 경우 아래의 번호로 전화 주시면 상세 안내 드리겠습니다.
                        </li>
                        <li>
                          방문 수령 시 나무 상태를 직접 확인하신 후 선택하여 구매하실 수 있습니다.
                          <br />
                          <span className="font-semibold">연락처 : 010-8925-6251</span>
                        </li>
                        <li>
                          영업 시간
                          <div className="mt-1 pl-3 space-y-1">
                            <p>평일 : 오전 9시 ~ 오후 6시 <span className="text-muted-foreground">(방문 2시간 전에 전화 연락 후 방문 부탁드립니다.)</span></p>
                            <p>주말 : 방문 1일 전 전화 연락 후 방문 <span className="text-muted-foreground">(개인 사정으로 방문이 어려울 수도 있습니다.)</span></p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="returns">
                  <AccordionTrigger>교환 / 환불 규정</AccordionTrigger>
                  <AccordionContent className="font-sans font-normal text-foreground">
                    <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                      상세 내용은 추후 업데이트 예정입니다.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {showBackButton && (
                <div className="mt-16">
                  <BackButton />
                </div>
              )}
            </div>

            <div className="md:pt-14">
              <div className="border border-border">

                <ul className="divide-y divide-border">
                  {sorted.flatMap((product) => {
                    const p = product.node;
                    const isActive = p.id === activeProduct.node.id;
                    return p.variants.edges.map((v, vi) => {
                      const thumb = p.variantImages?.[v.node.title]?.[0]?.node ?? p.images.edges[0]?.node;
                      const variant = v.node;
                      const qty = getQty(variant.id);
                      const inCart = cartQtyByVariant[variant.id] ?? 0;
                      return (
                        <li
                          key={variant.id}
                          className={`flex flex-wrap sm:flex-nowrap items-center gap-x-3 gap-y-3 px-3 sm:px-4 py-3 cursor-pointer transition-colors ${
                            isActive && activeVariant?.id === variant.id ? "bg-secondary/40" : "hover:bg-secondary/20"
                          }`}
                          onClick={() => selectProduct(p.id, variant.id)}
                        >
                          <div className="w-12 h-12 bg-secondary overflow-hidden flex-shrink-0">
                            {thumb && (
                              <img
                                src={thumb.url}
                                alt={`${p.title} ${variant.title}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            )}
                          </div>
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
                          <div className="flex items-center gap-1.5 whitespace-nowrap ml-auto sm:ml-0">
                            <span className="border border-red-600 text-red-600 text-[10px] font-semibold px-1.5 py-0.5 leading-none">
                              용달
                            </span>
                            <span className="text-sm tabular-nums font-semibold font-sans">
                              {formatPrice(variant.price.amount, variant.price.currencyCode)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <div
                              className="inline-flex items-center border border-border font-sans"
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
                                className="w-10 text-center text-sm tabular-nums bg-transparent border-0 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-sans"
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
                <Button asChild size="lg" className="rounded-none hover:text-accent">
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
            <AlertDialogCancel className="rounded-none hover:bg-background hover:text-foreground">취소</AlertDialogCancel>
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

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 bg-background border-none rounded-none [&>button]:hidden">
          {activeProduct && images[activeImage] && (
            <div className="relative">
              <img
                src={images[activeImage].node.url}
                alt={images[activeImage].node.altText || activeProduct.node.title}
                className="w-full max-h-[85vh] object-contain bg-black"
              />
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-3 right-3 bg-background/90 hover:bg-background p-2 rounded-full shadow"
                aria-label="닫기"
              >
                <X className="h-5 w-5" />
              </button>
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImage((i) => (i - 1 + images.length) % images.length)
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-3 rounded-full shadow"
                    aria-label="이전 사진"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-3 rounded-full shadow"
                    aria-label="다음 사진"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-xs tabular-nums">
                    {activeImage + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useShopifyProduct } from "@/hooks/useShopifyProducts";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading } = useShopifyProduct(handle);
  const addItem = useCartStore(s => s.addItem);
  const isAdding = useCartStore(s => s.isLoading);

  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </SiteLayout>
    );
  }

  if (!product) {
    return (
      <SiteLayout>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 text-center">
          <p className="font-display text-2xl mb-3 font-sans">Tree not found</p>
          <Link to="/shop" className="text-sm underline">Back to shop</Link>
        </div>
      </SiteLayout>
    );
  }

  const p = product.node;
  const variants = p.variants.edges;
  const variant = variants[variantIndex]?.node;
  const images = p.images.edges;

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to cart", { description: p.title, position: "top-center" });
  };

  return (
    <SiteLayout>
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8">
        <Button asChild className="rounded-none font-sans font-bold">
          <Link to="/cart">
            장바구니
          </Link>
        </Button>
      </div>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-10 grid md:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <div className="aspect-[4/5] bg-secondary overflow-hidden mb-3">
            {images[activeImage] && (
              <img
                src={images[activeImage].node.url}
                alt={images[activeImage].node.altText || p.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square overflow-hidden border ${i === activeImage ? 'border-foreground' : 'border-transparent'}`}
                >
                  <img src={img.node.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="font-display text-4xl md:text-5xl mb-4 font-bold font-sans">{p.title}</h1>
          {variant && (
            <div className="mb-6">
              <p className="text-xl tabular-nums font-sans mb-1">
                {formatPrice(variant.price.amount, variant.price.currencyCode)}
              </p>
              {variant.description && (
                <p className="text-sm text-muted-foreground break-keep">
                  {variant.description}
                </p>
              )}
            </div>
          )}
          {p.descriptionHtml ? (
            <div
              className="leading-relaxed mb-8 space-y-3 font-normal font-sans text-black text-base md:text-lg"
              dangerouslySetInnerHTML={{ __html: p.descriptionHtml }}
            />
          ) : (
            <p className="leading-relaxed mb-8 whitespace-pre-line font-normal font-sans text-black text-base md:text-lg">{p.description}</p>
          )}

          {variants.length > 1 && (
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v, i) => (
                  <button
                    key={v.node.id}
                    onClick={() => setVariantIndex(i)}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      i === variantIndex ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground'
                    }`}
                  >
                    {v.node.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">수량</p>
            <div className="inline-flex items-center border border-border font-sans">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-secondary font-sans">
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-10 text-center text-sm tabular-nums font-sans">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-secondary font-sans">
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          <Button
            size="lg"
            className="rounded-none w-full md:w-auto md:min-w-[280px]"
            onClick={handleAdd}
            disabled={isAdding || !variant?.availableForSale}
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : variant?.availableForSale === false ? 'Sold out' : '장바구니 담기'}
          </Button>

          <Accordion type="single" collapsible className="mt-10 font-sans font-bold">
            <AccordionItem value="shipping">
              <AccordionTrigger>나무 배송 안내</AccordionTrigger>
              <AccordionContent className="font-sans font-normal text-black">
                <div className="space-y-4 text-base md:text-lg leading-relaxed">
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
              <AccordionContent className="font-sans font-normal text-black">
                네덜란드에서 조직배양한 묘목을 국내에서 재배
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pickup">
              <AccordionTrigger>방문 구입 또는 직접 나무 수령시 안내</AccordionTrigger>
              <AccordionContent className="font-sans font-normal text-black">
                <div className="space-y-4 text-base md:text-lg leading-relaxed">
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
              <AccordionContent className="font-sans font-normal text-black">
                <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                  상세 내용은 추후 업데이트 예정입니다.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </SiteLayout>
  );
};

export default ProductDetail;

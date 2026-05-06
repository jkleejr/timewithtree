import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, Minus, Plus, ArrowLeft } from "lucide-react";
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
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-sans font-bold">
          <ArrowLeft className="h-4 w-4" /> 뒤로 가기
        </Link>
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
            <p className="text-xl tabular-nums mb-6">
              {formatPrice(variant.price.amount, variant.price.currencyCode)}
            </p>
          )}
          {p.descriptionHtml ? (
            <div
              className="leading-relaxed mb-8 space-y-3 font-normal font-sans text-black"
              dangerouslySetInnerHTML={{ __html: p.descriptionHtml }}
            />
          ) : (
            <p className="leading-relaxed mb-8 whitespace-pre-line font-normal font-sans text-black">{p.description}</p>
          )}

          {variants.length > 1 && (
            <div className="mb-6">
              <p className="uppercase tracking-widest mb-3 text-xl font-semibold text-primary font-bold font-sans">Size</p>
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
            <p className="uppercase tracking-widest mb-3 text-xl font-semibold text-primary font-bold font-sans">수량</p>
            <div className="inline-flex items-center border border-border">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-secondary">
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-10 text-center text-sm tabular-nums">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-secondary">
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
              <AccordionTrigger>배송 및 관리</AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-sans font-normal text-black">
                나무는 크기에 따라 뿌리가 드러난 상태(bare-root)나 화분에 심긴 상태로 배송되며, 수피와 뿌리를 보호하기 위해 정성스럽게 포장됩니다. {"\n\n"}
                배수가 잘 되는 토양에 심고, 햇빛이 잘 들거나 약간 그늘진 곳이 적합합니다. {"\n"}
                식재 후 첫 시즌에는 물을 충분히 깊게 주어야 합니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="origin">
              <AccordionTrigger>원산지</AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-sans font-normal text-black">
                서늘한 기후와 깨끗한 공기로 밝고 하얀 수피를 자랑하는 대한민국 강원도 고산지대 농장에서 직접 재배되었습니다.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </SiteLayout>
  );
};

export default ProductDetail;

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, Minus, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useShopifyProduct } from "@/hooks/useShopifyProducts";
import { useCartStore } from "@/stores/cartStore";

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
          <p className="font-display text-2xl mb-3">Tree not found</p>
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
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
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
          <h1 className="font-display text-4xl md:text-5xl mb-4 font-serif font-bold">{p.title}</h1>
          {variant && (
            <p className="text-xl tabular-nums mb-6">
              {variant.price.currencyCode} {parseFloat(variant.price.amount).toFixed(2)}
            </p>
          )}
          <p className="leading-relaxed mb-8 whitespace-pre-line font-normal font-serif text-black">{p.description}</p>

          {variants.length > 1 && (
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Size</p>
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
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Quantity</p>
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
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : variant?.availableForSale === false ? 'Sold out' : 'Add to cart'}
          </Button>

          <Accordion type="single" collapsible className="mt-10">
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & care</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Trees ship bare-root or potted depending on size, carefully wrapped to protect the bark and roots.
                Plant in well-drained soil with full sun to partial shade. Water deeply for the first season.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="origin">
              <AccordionTrigger>Origin</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Grown at our family nursery in the highlands of South Korea, where cool climate and clean air
                produce the bright white bark Korean birch is known for.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </SiteLayout>
  );
};

export default ProductDetail;

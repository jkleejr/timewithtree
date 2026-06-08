import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ShopifyProduct } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";

export const ProductListRow = ({ product }: { product: ShopifyProduct }) => {
  const p = product.node;
  const images = p.images.edges;
  const variants = p.variants.edges;

  const [activeImage, setActiveImage] = useState(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const addItem = useCartStore(s => s.addItem);
  const isAdding = useCartStore(s => s.isLoading);

  const getQty = (id: string) => quantities[id] ?? 1;
  const setQty = (id: string, q: number) =>
    setQuantities(prev => ({ ...prev, [id]: Math.min(100, Math.max(0, q)) }));

  const handleAdd = async (variantIndex: number) => {
    const variant = variants[variantIndex]?.node;
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: getQty(variant.id),
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("장바구니에 담았습니다", { description: `${p.title} — ${variant.title}`, position: "top-center" });
  };

  return (
    <article className="grid md:grid-cols-2 gap-8 lg:gap-12 py-10 border-t border-border first:border-t-0">
      {/* Left: Image gallery */}
      <div>
        <Link to={`/product/${p.handle}`} className="block aspect-[4/5] bg-secondary overflow-hidden mb-3">
          {images[activeImage] ? (
            <img
              src={images[activeImage].node.url}
              alt={images[activeImage].node.altText || p.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
          )}
        </Link>
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {images.slice(0, 5).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`aspect-square overflow-hidden border ${i === activeImage ? "border-foreground" : "border-transparent"}`}
              >
                <img src={img.node.url} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Info + variant list */}
      <div className="flex flex-col">
        <Link to={`/product/${p.handle}`}>
          <h2 className="font-display font-sans font-bold text-2xl md:text-3xl mb-3 hover:underline">
            {p.title}
          </h2>
        </Link>
        <p className="text-sm text-muted-foreground mb-5">
          ​
        </p>

        <ul className="divide-y divide-border border-y border-border">
          {variants.map((v, i) => {
            const variant = v.node;
            const qty = getQty(variant.id);
            return (
              <li key={variant.id} className="flex flex-col sm:flex-row sm:items-center gap-3 py-4">
                <div className="flex-1 min-w-0">
                  {variant.title !== "Default Title" && (
                    <p className="text-sm font-medium">{variant.title}</p>
                  )}
                  <p className="text-primary text-base md:text-lg break-keep">
                    예상출고시기: <span className="text-foreground">즉시배송 가능</span>
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end sm:flex-none">
                  <span className="text-sm tabular-nums font-semibold whitespace-nowrap">
                    {formatPrice(variant.price.amount, variant.price.currencyCode)}
                  </span>
                  <div className="inline-flex items-center border border-border shrink-0">
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
                    className="rounded-none h-9 w-9 shrink-0"
                    onClick={() => handleAdd(i)}
                    disabled={isAdding || !variant.availableForSale}
                    aria-label="Add to cart"
                  >
                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="text-xs text-muted-foreground mt-4">
          ⓘ 생물 특성상 실제 받아보시는 상품과 다소(계절별) 차이가 날 수 있습니다.
        </p>
      </div>
    </article>
  );
};

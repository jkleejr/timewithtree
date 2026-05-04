import { Link } from "react-router-dom";
import type { ShopifyProduct } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";

export const ProductCard = ({ product }: { product: ShopifyProduct }) => {
  const p = product.node;
  const image = p.images.edges[0]?.node;
  const price = p.priceRange.minVariantPrice;

  return (
    <Link to={`/product/${p.handle}`} className="group block">
      <div className="aspect-[4/5] bg-secondary overflow-hidden mb-4">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || p.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-lg leading-tight font-sans">{p.title}</h3>
        <span className="text-sm tabular-nums whitespace-nowrap">
          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
        </span>
      </div>
    </Link>
  );
};

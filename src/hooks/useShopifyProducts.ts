// Local catalog hooks — preserve the original hook names so consumers
// don't need import-path changes. The data now comes from src/data/products.ts.
import { useMemo } from "react";
import { LOCAL_PRODUCTS, type ShopifyProduct } from "@/data/products";

export function useShopifyProducts(_first = 50) {
  const data = useMemo(() => LOCAL_PRODUCTS, []);
  return { data, isLoading: false } as { data: ShopifyProduct[]; isLoading: boolean };
}

export function useShopifyProduct(handle: string | undefined) {
  const data = useMemo(() => {
    if (!handle) return null;
    return LOCAL_PRODUCTS.find((p) => p.node.handle === handle) ?? null;
  }, [handle]);
  return { data, isLoading: false } as { data: ShopifyProduct | null; isLoading: boolean };
}

import { useQuery } from '@tanstack/react-query';
import { storefrontApiRequest, STOREFRONT_QUERY, PRODUCT_BY_HANDLE_QUERY, type ShopifyProduct } from '@/lib/shopify';

export function useShopifyProducts(first = 50) {
  return useQuery({
    queryKey: ['shopify-products', first],
    queryFn: async () => {
      const data = await storefrontApiRequest(STOREFRONT_QUERY, { first, query: null });
      return (data?.data?.products?.edges ?? []) as ShopifyProduct[];
    },
  });
}

export function useShopifyProduct(handle: string | undefined) {
  return useQuery({
    queryKey: ['shopify-product', handle],
    queryFn: async () => {
      if (!handle) return null;
      const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
      const node = data?.data?.productByHandle;
      return node ? ({ node } as ShopifyProduct) : null;
    },
    enabled: !!handle,
  });
}

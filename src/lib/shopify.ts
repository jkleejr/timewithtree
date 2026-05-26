// Back-compat shim: the project no longer integrates with Shopify.
// Re-export the product type from the local catalog so existing imports
// (`import type { ShopifyProduct } from "@/lib/shopify"`) keep working.
export type { ShopifyProduct } from "@/data/products";

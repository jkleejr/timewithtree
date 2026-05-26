// Local product catalog — replaces Shopify product source.
// To change prices, descriptions, or images, edit this file directly.

import heroMain1 from "@/assets/hero-main-1.jpg";
import heroMain3 from "@/assets/hero-main-3.jpg";
import heroBirch3 from "@/assets/hero-birch-3.jpg";
import farmJac1 from "@/assets/farm-jac-1.png";
import dagan1 from "@/assets/dagan-1.jpg";

// Type intentionally mirrors the previous Shopify shape so existing
// components can consume products without refactoring.
export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    descriptionHtml: string;
    handle: string;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    images: {
      edges: Array<{ node: { url: string; altText: string | null } }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

const VARIANTS = [
  { id: "jacq-r3", title: "R3", amount: "120000" },
  { id: "jacq-r4", title: "R4", amount: "160000" },
  { id: "jacq-r5", title: "R5", amount: "200000" },
  { id: "jacq-dagan", title: "다간형", amount: "200000" },
];

const DESCRIPTION = `네덜란드에서 조직배양한 묘목을 국내에서 재배한 잭큐몬티 자작나무입니다.\n에어포트(Air-Pot)에서 재배되어 뿌리 품질이 우수하고, 연중 식재가 가능하며 식재 후 활착이 매우 빠릅니다.\n\n• 사이즈: R3 / R4 / R5 / 다간형\n• 즉시 배송 가능`;

export const LOCAL_PRODUCTS: ShopifyProduct[] = [
  {
    node: {
      id: "local-jacquemontii",
      title: "잭큐몬티 자작나무",
      description: DESCRIPTION,
      descriptionHtml: `<p>${DESCRIPTION.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>")}</p>`,
      handle: "jacquemontii-birch",
      priceRange: {
        minVariantPrice: { amount: "120000", currencyCode: "KRW" },
      },
      images: {
        edges: [
          { node: { url: heroMain1, altText: "잭큐몬티 자작나무 — 농장 전경" } },
          { node: { url: heroMain3, altText: "성목으로 자란 잭큐몬티 자작나무" } },
          { node: { url: heroBirch3, altText: "잭큐몬티 자작나무 수피 클로즈업" } },
          { node: { url: farmJac1, altText: "농장에서 자라는 잭큐몬티 자작나무" } },
          { node: { url: dagan1, altText: "다간형 잭큐몬티 자작나무" } },
        ],
      },
      variants: {
        edges: VARIANTS.map((v) => ({
          node: {
            id: v.id,
            title: v.title,
            price: { amount: v.amount, currencyCode: "KRW" },
            availableForSale: true,
            selectedOptions: [{ name: "사이즈", value: v.title }],
          },
        })),
      },
      options: [{ name: "사이즈", values: VARIANTS.map((v) => v.title) }],
    },
  },
];

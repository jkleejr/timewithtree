// Local product catalog — replaces Shopify product source.
// To change prices, descriptions, or images, edit this file directly.

import r3Img1 from "@/assets/r3-1.jpg";
import r3Img2 from "@/assets/r3-2.jpg";
import r3Img3 from "@/assets/r3-3.jpg";
import r4Img1 from "@/assets/r4-1.jpg";
import r4Img2 from "@/assets/r4-2.jpg";
import r4Img3 from "@/assets/r4-3.jpg";
import r4Img4 from "@/assets/r4-4.jpg";
import daganImg1 from "@/assets/dagan-1.jpg";
import daganImg2 from "@/assets/dagan-2.jpg";
import r5Img1 from "@/assets/r5-1.jpg";
import r5Img2 from "@/assets/r5-2.jpg";



// Type intentionally mirrors the previous Shopify shape so existing
// components can consume products without refactoring.
export interface ShopifyProductImage {
  node: { url: string; altText: string | null };
}

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
      edges: ShopifyProductImage[];
    };
    variantImages?: Record<string, ShopifyProductImage[]>;
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

const DESCRIPTION = `네덜란드에서 조직배양한 묘목을 국내에서 재배한 구매하기입니다.\n에어포트(Air-Pot)에서 재배되어 뿌리 품질이 우수하고, 연중 식재가 가능하며 식재 후 활착이 매우 빠릅니다.\n\n• 사이즈: R3 / R4 / R5 / 다간형\n• 즉시 배송 가능`;

export const LOCAL_PRODUCTS: ShopifyProduct[] = [
  {
    node: {
      id: "local-jacquemontii",
      title: "구매하기",
      description: DESCRIPTION,
      descriptionHtml: `<p>${DESCRIPTION.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>")}</p>`,
      handle: "jacquemontii-birch",
      priceRange: {
        minVariantPrice: { amount: "120000", currencyCode: "KRW" },
      },
      images: {
        edges: [
          { node: { url: r3Img1, altText: "R3 구매하기 수피 클로즈업" } },
          { node: { url: r3Img2, altText: "R3 구매하기 줄기 측정" } },
          { node: { url: r3Img3, altText: "R3 일자형 구매하기 전체 모습" } },
        ],
      },
      variantImages: {
        R3: [
          { node: { url: r3Img1, altText: "R3 구매하기 수피 클로즈업" } },
          { node: { url: r3Img2, altText: "R3 구매하기 줄기 측정" } },
          { node: { url: r3Img3, altText: "R3 일자형 구매하기 전체 모습" } },
        ],
        R4: [
          { node: { url: r4Img1, altText: "R4 구매하기 둘레 측정" } },
          { node: { url: r4Img2, altText: "R4 구매하기 줄기 클로즈업" } },
          { node: { url: r4Img3, altText: "R4 구매하기 전체 모습" } },
          { node: { url: r4Img4, altText: "R4 일자형 구매하기 농장 전경" } },
        ],
        R5: [
          { node: { url: r5Img1, altText: "R5 잭큐몬티 자작나무 수피 클로즈업" } },
          { node: { url: r5Img2, altText: "R5 잭큐몬티 자작나무 전체 모습" } },
        ],
        "다간형": [
          { node: { url: daganImg1, altText: "다간형 잭큐몬티 자작나무 전체 모습" } },
          { node: { url: daganImg2, altText: "다간형 잭큐몬티 자작나무 농장 전경" } },
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

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
          description?: string;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

const VARIANTS = [
  { id: "jacq-r3", title: "R3, 잭큐몬티 자작나무", amount: "100000", description: "근원직경 (줄기의 지면에 닿는 부분의 지름)이 3cm인 자작나무 묘목" },
  { id: "jacq-r4", title: "R4, 잭큐몬티 자작나무", amount: "120000", description: "근원직경 (줄기의 지면에 닿는 부분의 지름)이 4cm인 자작나무 묘목" },
  { id: "jacq-r5", title: "R5, 잭큐몬티 자작나무", amount: "150000", description: "근원직경 (줄기의 지면에 닿는 부분의 지름)이 5cm의 자작나무 묘목" },
  { id: "jacq-dagan", title: "다간형, 잭큐몬티 자작나무", amount: "150000", description: "한 나무에서 여러 줄기가 자라는 다간형 자작나무" },
];

const DESCRIPTION = `네덜란드에서 수입하여 국내에서 재배한 자작나무 묘목입니다.

에어포트(Air-Pot)에서 재배되어 뿌리 품질이 우수하고, 연중 식재가 가능하며 식재 후 활착이 매우 빠릅니다.

• 사이즈: R3 / R4 / R5 / 다간형
• 즉시 배송 가능`;

const DESCRIPTION_HTML = `<p>네덜란드에서 수입하여 국내에서 재배한 자작나무 묘목입니다.</p>
<p>에어포트(Air-Pot)에서 재배되어 뿌리 품질이 우수하고, 연중 식재가 가능하며 식재 후 활착이 매우 빠릅니다.</p>
<ul class="list-disc pl-5 space-y-1 text-foreground my-2">
  <li>사이즈: R3 / R4 / R5 / 다간형</li>
  <li>즉시 배송 가능</li>
</ul>`;

export const LOCAL_PRODUCTS: ShopifyProduct[] = [
  {
    node: {
      id: "local-jacquemontii",
      title: "잭큐몬티 자작나무",
      description: DESCRIPTION,
      descriptionHtml: DESCRIPTION_HTML,
      handle: "jacquemontii-birch",
      priceRange: {
        minVariantPrice: { amount: "100000", currencyCode: "KRW" },
      },
      images: {
        edges: [
          { node: { url: r3Img1, altText: "R3 구매하기 수피 클로즈업" } },
          { node: { url: r3Img2, altText: "R3 구매하기 줄기 측정" } },
          { node: { url: r3Img3, altText: "R3 일자형 구매하기 전체 모습" } },
        ],
      },
      variantImages: {
        "R3, 잭큐몬티 자작나무": [
          { node: { url: r3Img1, altText: "R3 구매하기 수피 클로즈업" } },
          { node: { url: r3Img2, altText: "R3 구매하기 줄기 측정" } },
          { node: { url: r3Img3, altText: "R3 일자형 구매하기 전체 모습" } },
        ],
        "R4, 잭큐몬티 자작나무": [
          { node: { url: r4Img1, altText: "R4 구매하기 둘레 측정" } },
          { node: { url: r4Img2, altText: "R4 구매하기 줄기 클로즈업" } },
          { node: { url: r4Img3, altText: "R4 구매하기 전체 모습" } },
          { node: { url: r4Img4, altText: "R4 일자형 구매하기 농장 전경" } },
        ],
        "R5, 잭큐몬티 자작나무": [
          { node: { url: r5Img1, altText: "R5 구매하기 수피 클로즈업" } },
          { node: { url: r5Img2, altText: "R5 구매하기 전체 모습" } },
        ],
        "다간형": [
          { node: { url: daganImg1, altText: "다간형 구매하기 전체 모습" } },
          { node: { url: daganImg2, altText: "다간형 구매하기 농장 전경" } },
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
            description: v.description,
          },
        })),
      },
      options: [{ name: "사이즈", values: VARIANTS.map((v) => v.title) }],
    },
  },
];

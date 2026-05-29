## Verification of 구매하기 checklist

I audited `ShopBrowser.tsx`, `Auth.tsx`, and `Cart.tsx` against your list.

### ✅ Already done

**2) Image click to zoom** — `ShopBrowser.tsx` lines 168–181 wrap the main product image in a button that opens a full-screen lightbox (`Dialog`, lines 491–532) with prev/next + close.

**3) "최신순 / 가격 낮은 순 / 가격 높은 순" sort removed** — no sort dropdown remains in `ShopBrowser.tsx` or `Shop.tsx`. The product list just uses `const sorted = products;` (no UI control).

**4) 나무 배송 안내 accordion** — `ShopBrowser.tsx` lines 249–272 already contain the exact copy you specified, inside an `Accordion` that expands on click:
- 에어포트 식재 안내 + 받침대 분리 문구
- 용달 배송 안내 (택배 불가, 화물차, 별도 청구, 직접 지불)

**5) 원산지 accordion** — lines 273–278 show "네덜란드에서 조직배양한 묘목을 국내에서 재배" on click.

**Login & Cart pages** — both load and function:
- `/auth` (`Auth.tsx`) uses Lovable Cloud auth with email/password validation via zod.
- `/cart` (`Cart.tsx`) reads from `useCartStore`, supports quantity update / remove / checkout navigation.

### ⚠️ Needs your action — item 1 (prices)

Product prices are **not** stored in this codebase. They are pulled live from your Shopify store via the Storefront API (`useShopifyProducts`). To set:
- R3 = ₩120,000
- R4 = ₩160,000
- R5 = ₩200,000
- 다간형 = ₩200,000

…they must be updated on the variants inside your **Shopify admin** (Products → variant → Price). Once saved there, the storefront will reflect them automatically — no code change needed.

### Suggested next step

Switch to build mode if you'd like me to:
1. QA the live preview by clicking through Shop → image zoom → accordions → add-to-cart → cart → login (and report anything broken with screenshots), and/or
2. Pull current Shopify prices to confirm whether R3/R4/R5/다간형 are already correct or still need editing in Shopify.

No code changes are required for items 2–5; item 1 is a Shopify admin edit.

# 구매하기 페이지 수정 + Shopify 제거

이 5가지 변경을 한 번에 처리하면서, 이전에 합의한 Shopify 제거도 같이 진행합니다 (가격 변경을 코드에서 직접 할 수 있게 됨).

## 1. Shopify 제거 + 로컬 상품 카탈로그

- 신규: `src/data/products.ts` — 잭큐몬티 자작나무 1개 상품, 4개 옵션
  - R3 — 120,000원
  - R4 — 160,000원
  - R5 — 200,000원
  - 다간형 — 200,000원
  - 이미지: 기존 `src/assets/` (hero-main-1/3, hero-birch-2/4/5 등) 재사용
- 신규: `src/hooks/useLocalProducts.ts` — 기존 `useShopifyProducts`와 동일한 인터페이스 반환 (Shopify 타입 모양 유지)
- 8개 사용처 교체: `ShopBrowser`, `ProductDetail`, `ProductCard`, `ProductListRow`, `SiteFooter`, `cartStore` 등
- 삭제: `src/lib/shopify.ts`, `src/hooks/useShopifyProducts.ts`
- 주문 흐름은 변경 없음 — `Checkout.tsx`가 이미 `orders` 테이블에 저장하고 `notify-admin-order`로 관리자 4명에게 자동 이메일 발송

## 2. 사진 클릭 시 라이트박스 확대

`ShopBrowser.tsx` 메인 이미지와 5장 썸네일에 클릭 핸들러 추가. shadcn `Dialog`로 전체 화면 확대 뷰 표시, 좌/우 화살표로 전환, ESC/배경 클릭으로 닫기.

## 3. 정렬 드롭다운(dead code) 제거

`SortKey` 타입, `sort` state, `sorted` `useMemo`의 가격 정렬 분기 제거. `products` 배열 그대로 사용.

## 4. "나무 배송 안내" 아코디언 내용 교체

`ShopBrowser.tsx` (그리고 동일한 아코디언이 있는 `ProductDetail.tsx`):
기존 "배송 및 관리" 아코디언을 "나무 배송 안내"로 라벨 변경하고 내용 교체:

```
〮 나무는 에어포트에 식재된 상태로 배송됩니다.
   식재시 반드시 에어포트 몸통과 하단 받침대를 분리 후 나무만 식재하세요.

〮 용달 배송 안내
   - 본 상품은 일반 택배로 배송이 불가하며, 용달(화물차)로만 배송됩니다.
     (용달은 일반 택배가 아닌 화물차 배송 서비스를 의미합니다)
   - 용달 배송비는 상품 금액과 별도로 청구되며, 용달 배송비는 용달(화물차)에 직접 지불하시면 됩니다.
```

## 5. "원산지" 아코디언 내용 교체

내용을 다음으로 교체:
> 네덜란드에서 조직배양한 묘목을 국내에서 재배

---

## 변경/생성/삭제 파일

**신규**
- `src/data/products.ts`
- `src/hooks/useLocalProducts.ts`

**수정**
- `src/components/ShopBrowser.tsx` — 새 훅, 라이트박스, 정렬 제거, 아코디언 2개 교체
- `src/pages/ProductDetail.tsx` — 새 훅, 동일한 아코디언 교체
- `src/components/ProductCard.tsx`, `ProductListRow.tsx`, `SiteFooter.tsx` — 새 훅
- `src/stores/cartStore.ts` — 타입 임포트 경로 정리

**삭제**
- `src/lib/shopify.ts`
- `src/hooks/useShopifyProducts.ts`
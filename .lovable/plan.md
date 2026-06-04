## Goal

Bring useful elements from the JB가든센터 reference screenshots into our shop/checkout flow — specifically the shipping/policy notice, the side-by-side order info layout, the order status progress badges, and a proper order-detail view.

## What's in the references

1. **"필독하세요!" notice box** — bullet list of shipping rules (택배비/용달비 부담, 제주/도서지역, 품절 옵션, 무통장 입금 안내) shown at the top of the order pages.
2. **Order header** — 주문번호 + table row showing product image, 상품명, 배송 방식 (택배/용달), 수량, 판매가, 소계, 상태 badge.
3. **Status flow badges** — 주문접수 → 입금완료 → 상품 준비중 → 상품 배송중 → 배송 완료, with the current step highlighted.
4. **Two-card layout** — 주문정보 (price breakdown) on the left, 결제정보 (order #, date, method, depositor, bank account) on the right.
5. **Orderer vs Recipient cards** — 주문하시는 분 / 받으시는 분 side-by-side with name, phone, email, address, delivery message.

## Plan

### 1. Shared `OrderPolicyNotice` component
- New file `src/components/OrderPolicyNotice.tsx`.
- Light bg box with a circular "!" icon and bulleted Korean policy text adapted to our farm:
  - 택배비/용달비는 고객님 부담
  - 제주도/도서산간 추가 배송비 별도
  - 품절 상품 포함 시 주문 불가 — 삭제 후 주문
  - 용달 배송비는 화물차 기사님께 직접 지불
  - 무통장 입금 후 관리자 확인 시 배송 진행
- Used at the top of `Cart.tsx`, `Checkout.tsx`, and the new `OrderDetail.tsx`.

### 2. Checkout page polish (`src/pages/Checkout.tsx`)
- Insert `<OrderPolicyNotice />` above the form grid.
- Keep existing structure; the orderer/recipient two-card layout already matches the reference, just confirm spacing.

### 3. New Order Detail page (`src/pages/OrderDetail.tsx`)
- Route: `/orders/:orderNumber` (added in `src/App.tsx`).
- Fetches the order by `order_number` from the `orders` table (RLS: must be the owning user, or guest lookup by email+order_number — see step 5).
- Renders:
  - `OrderPolicyNotice` at the top.
  - **Header card** with 주문번호 + items table (image, name, 배송: 용달, qty, unit price, subtotal, status badge).
  - **Status progress strip** — five pill badges (주문접수 / 입금완료 / 준비중 / 배송중 / 배송완료); current step colored, others muted. Derived from `orders.status` mapping.
  - **주문정보 / 결제정보** two-column grid: left shows price breakdown (소계, 배송비 "별도", 총주문금액, 미결제액); right shows order #, 주문일시, 결제방식 (무통장), 입금자명, 입금계좌 (NH농협 …).
  - **주문하시는 분 / 받으시는 분** two-column grid using stored customer fields + parsed shipping_address.
- Visual style matches existing site (border, font-display headings) — not a copy of JB's red/blue card borders; just the structure.

### 4. Order Success → link to detail
- In `src/pages/OrderSuccess.tsx`, replace "내 주문 보기" with a button linking to `/orders/{orderNumber}`.

### 5. Guest order lookup (optional but matches "비회원 주문조회")
- Add a small section on `OrderDetail.tsx` (or `/orders/lookup`) that lets guests enter order # + email to view. Implemented client-side via a `select` with `eq('order_number', n).eq('customer_email', email)`.
- Requires adding an RLS policy allowing `SELECT` when `order_number` + `customer_email` both match (or a `SECURITY DEFINER` RPC `lookup_order(order_number, email)`). Will use the RPC approach to avoid exposing all orders to anon.

### 6. Admin status updates
- No changes to admin UI in this pass — `OrderDetail` just reads whatever status the admin sets in `Admin.tsx`.

## Technical notes

- Status mapping: `orders.status` values currently include `pending`. Extend logical mapping (display only) to: `pending`→주문접수, `paid`→입금완료, `preparing`→준비중, `shipping`→배송중, `delivered`→배송완료. No DB schema change required; admin can set these strings.
- New RPC `public.lookup_order(p_order_number text, p_email text)` returns a single row; `SECURITY DEFINER`, granted to `anon, authenticated`.
- No changes to cart store or Shopify integration.

## Out of scope

- Redesigning the Shop product browser (`ShopBrowser.tsx`) — references are all about post-purchase pages.
- Changing the bank account, status enum, or admin workflow.

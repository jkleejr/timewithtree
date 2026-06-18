## Goal

When an order is successfully placed, send two emails:
- **Customer**: order confirmation with everything they need.
- **Admins (seller)**: full order + customer info so the order can be fulfilled.

Both emails are sent from `notify.timewithtree.co.kr` (already verified) via the existing Lovable email infrastructure.

## Current state

- Admin email already works: a database trigger on `orders` insert calls the `notify-admin-order` edge function, which sends the `new-order-admin` template to the 4 admin addresses (timewithtree@gmail.com, jklwjr@gmail.com, arminko2023@gmail.com, bj.euphoria@gmail.com). It already includes order number, customer name/phone/tel/email, shipping address, recipient (if different), delivery message, payment method, depositor name, bank account, items, subtotal, and customer note.
- Customer confirmation email: **missing**. Nothing is sent to the buyer today.

## What I'll build

### 1. New customer email template
`supabase/functions/_shared/transactional-email-templates/customer-order-confirmation.tsx`

Korean, branded to match `new-order-admin` (same card style, KRW formatting, Asia/Seoul timestamp). Contents:

- Heading: "주문이 정상적으로 접수되었습니다"
- Order number, order date, status ("입금 대기중")
- Order items list with quantities and per-line totals
- Subtotal / 총 주문 금액
- Bank transfer instructions (only when `paymentMethod === 'bank_transfer'`): bank account `NH농협은행 301-0327-2621-11`, account holder 고준서, depositor name they entered, exact amount to deposit, note that 용달 배송비 is paid directly to the driver
- Shipping address (recipient name, phone, address, requested delivery date, delivery message)
- Note: "품절일 경우 전화로 안내드리겠습니다."
- Contact line for questions (timewithtree@gmail.com)

Registered in `registry.ts` as `customer-order-confirmation`.

### 2. Trigger the customer email
Extend `supabase/functions/notify-admin-order/index.ts` so that, in addition to looping over admin recipients, it also invokes `send-transactional-email` once for `order.customer_email` with `templateName: 'customer-order-confirmation'` and `idempotencyKey: customer-confirm-${order.id}`.

This keeps a single trigger path (the existing DB trigger on `orders` insert), so no schema or trigger changes are needed and behavior stays best-effort — the checkout flow is never blocked if email sending hiccups.

### 3. Deploy
Deploy `notify-admin-order` after the code change. `send-transactional-email` and `process-email-queue` are already deployed.

## Payment verification (bank transfer)

The seller specifically needs to confirm payment before fulfilling. With bank transfer there is no automatic verification — the admin manually checks the bank account, then marks the order paid. The current setup supports this well:

- Order is inserted with status `pending` (enforced by `force_pending_order_status` trigger).
- Admin email tells the seller exactly what amount, from whom (`depositorName`), to which account.
- Customer email tells the buyer the same amount and account, so deposits match.

I am **not** wiring credit card / PG verification in this change — you mentioned adding that later. When you're ready, the natural follow-up is a "payment confirmed / 배송 준비중" email to the customer that fires when an admin flips the order status from `pending` → `paid` in the admin dashboard. I can add that template + status-change trigger as a separate step once you confirm you want it.

## Files touched

- `supabase/functions/_shared/transactional-email-templates/customer-order-confirmation.tsx` (new)
- `supabase/functions/_shared/transactional-email-templates/registry.ts` (register template)
- `supabase/functions/notify-admin-order/index.ts` (also invoke customer email)

No database migrations, no checkout-page changes, no new secrets.

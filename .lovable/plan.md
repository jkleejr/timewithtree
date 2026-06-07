## Current State

Seller notification IS already wired up end-to-end:

```text
Checkout form → orders INSERT → notify_admin_on_new_order DB trigger
  → notify-admin-order edge function → send-transactional-email
  → pgmq queue → process-email-queue (cron, 5s)
  → Lovable Email infra (notify.timewithtree.co.kr)
  → 4 admin inboxes
```

It should work the moment a real order is placed; nothing has been tested because no orders exist yet.

## What's Wrong With the Current Email

Checkout collects more info than the email shows. Today the `orders` table only has clean columns for the orderer + shipping address; the recipient info, orderer's secondary landline, and depositor name are crammed into a free-text `customer_note` field. The admin email then just dumps that note, so the seller has to parse a paragraph instead of reading clean fields. There is also no "payment" section at all (no bank account, no depositor name as a labeled field).

## Fix — Three Parts

### 1. Store order data in proper columns (DB migration)

Add to `public.orders`:

- `customer_tel` (text, nullable) — orderer landline
- `recipient_name` (text, nullable) — null = same as orderer
- `recipient_phone` (text, nullable)
- `recipient_tel` (text, nullable)
- `recipient_address` (text, nullable)
- `recipient_postal_code` (text, nullable)
- `delivery_message` (text, nullable) — moved out of customer_note
- `payment_method` (text, not null, default `'bank_transfer'`)
- `depositor_name` (text, nullable) — name on the bank deposit
- `bank_account` (text, nullable) — snapshot of the account string at time of order

Keep `customer_note` for genuinely freeform notes only. Existing RLS, triggers (`force_pending_order_status`, `validate_order_amounts`, `notify_admin_on_new_order`), and grants are unchanged.

### 2. Update `src/pages/Checkout.tsx`

Write the new fields directly into the insert instead of building the `noteLines` string. The form already captures everything we need — no new UI.

### 3. Redesign the seller email

Update `supabase/functions/_shared/transactional-email-templates/new-order-admin.tsx` and `supabase/functions/notify-admin-order/index.ts` to pass and render structured sections:

- **주문 정보** — order number, 주문일시, status (입금 대기중)
- **주문자 정보** — name, 핸드폰, 일반전화, email
- **받는 분 (배송지)** — name, 핸드폰, 일반전화, postal code + address, OR "주문자와 동일" with the orderer address repeated for convenience
- **결제 정보** — 결제수단 (무통장입금), 입금 계좌 (NH농협은행 301-0327-2621-11), 입금자명, 입금 확인 금액 (subtotal)
- **주문 상품** — line items + subtotal (current layout, polished)
- **전하시는 말씀** — only if present
- Footer: "입금 확인 후 관리자 페이지에서 상태를 '배송 준비중'으로 변경해주세요."

Sender, recipients, idempotency key, and queue path stay the same.

### 4. Deploy + verify

- Deploy `notify-admin-order` and `send-transactional-email` after the template change.
- Suggest the user place a 1-item test order so we can confirm via `email_send_log` that all 4 admin addresses received it.

## Technical Notes

- Card payment is still disabled in checkout, so `payment_method` will always be `'bank_transfer'` for now. Storing it as a column makes adding card/PG later trivial.
- No change to the customer-facing order confirmation flow or to `lookup_order`.
- No new secrets, no new connectors, no third-party email service — all on existing Lovable Emails infra.
- Existing orders (none yet) wouldn't need backfill, but the new columns are nullable so old rows would still render gracefully if any existed.

## Out of Scope

- Actual payment gateway / automatic payment verification — bank transfer remains manual.
- Customer-facing order confirmation email (not requested; can add after).
- SMS/Kakao notifications.

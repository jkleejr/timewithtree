## Current state

The order status IS visible to customers, but only if they actively visit:
- **`/account`** (logged-in users) — shows a status badge per order ("결제 대기 / 결제 완료 / 배송중 / 취소").
- **`/order/:orderNumber`** (logged-in users and guests via order-number + email lookup) — shows a step progress bar (pending → paid → shipped) plus a cancelled state.

When the admin changes status in `/admin`, the database is updated immediately, so the customer sees the new status the next time they load one of those pages. There is **no active notification** — no email, no SMS, no realtime push. Most customers will never know the status changed unless they happen to revisit.

## Recommendation: status-change email notifications

The simplest, highest-value addition is to email the customer whenever the admin moves the order to a new status. This matches how Korean e-commerce stores typically communicate (입금 확인, 배송 시작, 주문 취소).

### What to build

1. **DB trigger on `orders` status change**
   - New `AFTER UPDATE ... WHEN (OLD.status IS DISTINCT FROM NEW.status)` trigger on `public.orders`.
   - Calls a new edge function `notify-order-status-change` via `net.http_post` with `{ order_id, old_status, new_status }`, using the same `email_queue_service_role_key` vault pattern as `notify_admin_on_new_order`.

2. **New edge function `notify-order-status-change`**
   - Same auth pattern we just fixed (accept service-role bearer token directly OR JWT).
   - Loads the order, picks the right customer-facing template per new status, and invokes `send-transactional-email` with an idempotency key like `status-${order.id}-${new_status}` (so retries don't double-send).
   - Skips silently when the customer has no email, or when transitioning to/from `pending` in ways that aren't worth notifying (configurable below).

3. **New customer email templates** in `supabase/functions/_shared/transactional-email-templates/` (registered in `registry.ts`):
   - `customer-order-paid` — "입금이 확인되었습니다" (pending → paid).
   - `customer-order-shipped` — "상품이 발송되었습니다" (paid → shipped). Optional fields for courier/tracking later.
   - `customer-order-cancelled` — "주문이 취소되었습니다" (→ cancelled).
   - Reuse the styling/layout from the existing `customer-order-confirmation` template so branding stays consistent.

4. **Admin UI polish (optional, small)**
   - In `/admin`, add a subtle hint next to the status dropdown like "상태 변경 시 고객에게 이메일이 발송됩니다" so the admin knows the email goes out automatically.

### Which transitions trigger which email

| From → To | Email sent |
|---|---|
| pending → paid | customer-order-paid |
| pending → shipped | customer-order-paid + customer-order-shipped (or just shipped, see question below) |
| paid → shipped | customer-order-shipped |
| any → cancelled | customer-order-cancelled |
| anything → pending | no email (admin reverting) |
| shipped → paid / paid → pending | no email (admin correcting a mistake) |

### Out of scope (can add later)
- SMS / KakaoTalk notifications.
- Realtime in-app banner via Supabase Realtime on the order detail page.
- Courier tracking number field on orders + clickable tracking link in the shipped email.

## Questions before implementing

1. **Should "pending → shipped" send one email (shipped only) or two (paid then shipped)?** I'd default to one shipped email — sending two at once is noisy.
2. **Do you want a tracking number field** added to orders now so the shipped email can include it, or leave that for later?
3. **Anything else you want notified on** — e.g., a generic "주문 확인 완료" when admin first reviews, or only the three transitions above?

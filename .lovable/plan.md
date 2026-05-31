## Goal
Restructure the checkout page (`src/pages/Checkout.tsx`) into a two-column 주문자/수령인 layout matching the reference (JB가든센터 style), and wire up Daum 우편번호 lookup. 결제정보 block stays as-is from the previous pass.

## New form structure

**주문하시는 분 (orderer)**
- 이름 *
- 핸드폰 * (mobile)
- 전화번호 (landline, optional)
- 이메일 *
- 주소 *: 우편번호 + [주소 검색] 버튼, 기본주소, 상세주소, 참고항목(optional)

**받으시는 분 (recipient)**
- ☑ 주문자와 동일 (default on — when on, hide/disable inputs and mirror orderer values into recipient fields on submit)
- 이름 *
- 핸드폰 *
- 전화번호 (optional)
- 주소 *: same 우편번호 + 검색 + 기본/상세/참고
- 전하시는 말씀 (textarea, optional) — replaces current 배송 메모

No 비밀번호 field.

## Layout
- Desktop (≥md): two side-by-side cards (`grid md:grid-cols-2 gap-6`) for 주문자 / 수령인, mirroring the reference. Labels on the left (`grid-cols-[80px_1fr]` inside each row) for a clean form-table feel.
- Mobile: stacked.
- 결제정보 card and 주문 요약 sidebar: unchanged from current.
- Keep current typography/border style (`border border-border`, no rounded), no introduction of new colors. Continue using semantic tokens.

## Daum 우편번호 integration
- Load `//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js` lazily via a small `useDaumPostcode` hook (inject `<script>` once, resolve when `window.daum.Postcode` is ready). No API key required, no secret needed.
- "주소 검색" button opens `new window.daum.Postcode({ oncomplete })` popup; on complete, fill 우편번호 + 기본주소 for that section and focus 상세주소.
- One hook, two callers (orderer + recipient).

## Data / submission changes
- Extend zod schema with: orderer (name, phone, tel, email, postal, address1, address2, address_note) + recipient (name, phone, tel, postal, address1, address2, address_note, delivery_message). Recipient fields validated only when "주문자와 동일" is off; otherwise copied from orderer at submit time.
- Compose `shipping_address` for the existing `orders` table as: `[우편번호] 기본주소 상세주소 (참고: 참고항목)` from the recipient block. `postal_code` ← recipient 우편번호.
- Append recipient name/phone and 전하시는 말씀 into `customer_note` along with existing `[입금자명]` line so admin sees everything. No DB migration.
- `customer_name / customer_phone / customer_email` continue to come from the orderer block (these represent the buyer/order contact).

## Out of scope
- 결제정보 / 무통장 입금 section (already done last turn).
- 비회원 비밀번호, 주문조회.
- Database schema changes.
- Restyling the order summary sidebar.

## Files touched
- `src/pages/Checkout.tsx` — rewrite the form section, add recipient state + sameAsOrderer logic, integrate hook.
- `src/hooks/useDaumPostcode.ts` — new, ~30 lines.

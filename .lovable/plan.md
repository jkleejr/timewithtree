## Goal
Align the checkout page's 용달배송 label with the reference spec.

## Change
In `src/pages/Checkout.tsx`:
1. 결제정보 금액 요약 block: `별도 (착불)` → `별도`
2. 주문 요약 사이드바: already says `별도` (no change needed there)

Everything else in the reference (결제정보 heading, 무통장입금 안내, 결제수단 토글, 계좌번호 + 계좌복사, 입금자명 + 주문자 동일 체크박스, 신용카드 박스) is already implemented and matches.

## Notes
- No backend, schema, or routing changes.
- No styling overhaul — purely a copy tweak.
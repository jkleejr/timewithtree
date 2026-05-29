## Verification — 교환/환불 + 방문 수령 안내

Audited `ShopBrowser.tsx` (구매하기 page) and `ProductDetail.tsx` (상세 페이지).

### ✅ 교환 / 환불 규정 박스
Present on **both** pages as the last accordion item:
- `ShopBrowser.tsx` lines 306–313
- `ProductDetail.tsx` lines 212–219

Current placeholder text: "상세 내용은 추후 업데이트 예정입니다." — waiting on the detailed copy you mentioned you'd send later.

### ✅ 방문 구입 또는 직접 나무 수령시 안내
**Order** — correct on both pages: 나무 배송 안내 → 원산지 → 방문 구입 안내 → 교환/환불 규정.
- `ShopBrowser.tsx` lines 279–305
- `ProductDetail.tsx` lines 185–211

**Content** — already matches your spec on both pages:
- 세종시 장군면 송문리 + 공주시 정안면 대산리 2개 농장 안내
- 전화 안내 문구
- 방문 수령 시 직접 확인 후 구매 + 연락처 010-8925-6251
- 영업 시간 (평일 9–18시 / 주말 1일 전 전화)

### No code changes needed
Everything on this checklist is already implemented. Once you share the final 교환/환불 규정 text, I'll drop it into both accordions (one edit each).

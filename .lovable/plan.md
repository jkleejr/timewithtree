# 배송중 알림을 수동 버튼으로 분리

## 변경 사항

1. **자동 이메일 비활성화**
   - `notify-order-status-change` Edge Function에서 `shipped` 전환 시 메일 발송 로직 제거 (다른 상태 변경도 더 이상 고객에게 메일 발송 안 함 — `paid`, `completed`, `cancelled` 포함)
   - 결과: 관리자가 드롭다운에서 상태를 바꿔도 고객에게 자동 메일은 안 감

2. **"배송중 알림 보내기" 버튼 추가 (관리자 페이지)**
   - 각 주문 카드의 상태 드롭다운 옆에 작은 버튼 `배송중 알림 메일` 추가
   - 클릭 시:
     - 주문 상태를 `shipped`(배송중)로 자동 변경
     - 고객에게 `customer-order-shipped` 템플릿으로 메일 발송 (기존 템플릿 그대로 사용)
     - 중복 방지: 이미 메일 보낸 주문이면 버튼이 `메일 발송됨 ✓`으로 비활성화 표시
   - 발송 기록은 `orders` 테이블에 `shipped_email_sent_at` 컬럼을 추가해 저장

## 기술 세부사항

- **DB 마이그레이션**: `orders.shipped_email_sent_at timestamptz` 컬럼 추가
- **Edge Function 수정**: `supabase/functions/notify-order-status-change/index.ts` — 모든 자동 메일 발송 제거 (혹은 함수 자체 호출 중단을 위해 DB 트리거 `notify_customer_on_status_change` 자체를 DROP)
  - 권장: 트리거를 DROP해서 깔끔하게 끊고, 함수는 남겨두되 호출 안 되게 함
- **새 Edge Function**: `send-shipped-notification` — 주문 ID 받아서 상태 업데이트 + `send-transactional-email` 호출 + `shipped_email_sent_at` 기록 (관리자 권한 검증 포함)
- **프론트엔드**: `src/pages/Admin.tsx`에 버튼 + `invoke('send-shipped-notification', { order_id })` 추가, 응답 후 로컬 상태 업데이트

이대로 진행할까요?

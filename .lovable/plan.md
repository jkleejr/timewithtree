## 히어로 섹션에 "자작나무 소개" 버튼 복원

`src/pages/Index.tsx`의 히어로 오버레이 (line 109–117) 안의 `<ul>` 바로 아래에 `/about` 페이지로 이동하는 "자작나무 소개" 버튼을 다시 추가합니다.

- `react-router-dom`의 `Link` import 추가
- 버튼 스타일: 흰색 외곽선 + 투명 배경 + hover 시 채움 (히어로 이미지 위에 잘 보이도록), shadcn `Button asChild variant="outline"` 사용
- 모바일/데스크탑에서 자연스럽게 보이도록 사이즈 반응형 처리

**변경 파일:** `src/pages/Index.tsx` (단일 파일, 약 8줄 추가)
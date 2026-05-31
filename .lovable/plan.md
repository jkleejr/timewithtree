## Goal
Update only the **content** in the footer. Keep current layout, colors, fonts, and the existing two-area structure (left: brand/목차, right: FarmContact grid).

## Content changes

**Right side — replace the current 농장 주소 / 연락처 / 상담 가능 시간 grid in `FarmContact` (footer variant) with a single 회사 정보 block:**

```
나무와 걷는 시간

상호 : 나무와 걷는 시간
사업자등록번호 : 302-93-11822
통신판매신고 :
문의전화 : 010-8925-6251
이메일 : timewithtree@gmail.com
제1농장 : 세종시 장군면 송문리
제2농장 : 충청남도 공주시 정안면 대산리
```

- Phone → `tel:01089256251` link
- Email → `mailto:timewithtree@gmail.com` link
- 통신판매신고 left blank
- Brand wordmark at top of block

**Bottom bar:** update right-side text from `주문 문의: timewithtree@gmail.com` to drop the email (now in the block) — or keep, your call. Left side stays `© {year} 나무와 걷는 시간`.

**Left side (목차 nav grid):** unchanged.

The on-page Visit & Contact section (FarmContact `variant="section"` on the home page) is **not changed** — only the `variant="footer"` rendering is updated.

## Files touched
- `src/components/FarmContact.tsx` — replace the `variant === "footer"` return with the new info block. `variant === "section"` (homepage) untouched.
- `src/components/SiteFooter.tsx` — no structural change; possibly tweak the bottom bar email text per your call.

No color/token/font/layout-grid changes. No new components.

## One question
Bottom bar right currently reads `주문 문의: timewithtree@gmail.com`. Keep it or remove it (since email is now in the info block)?

## Goal
Create a publicly accessible RSS 2.0 feed at `https://timewithtree.co.kr/rss.xml` containing both product variants and static pages, so it can be submitted to Naver Search Advisor.

## What goes in the feed
**Products** (from `src/data/products.ts`, one item per variant):
- R3, 잭큐몬티 자작나무 — ₩100,000
- R4, 잭큐몬티 자작나무 — ₩120,000
- R5, 잭큐몬티 자작나무 — ₩150,000
- 다간형, 잭큐몬티 자작나무 — ₩150,000

Each item: `<title>`, `<link>` (→ `/product/jacquemontii-birch`), `<description>` (variant description + price), `<guid>` (variant id), `<pubDate>`.

**Pages** (mirror the public entries already in `scripts/generate-sitemap.ts`):
- `/` 나무와 걷는 시간 — 잭큐몬티 자작나무 농장
- `/shop` 구매하기
- `/about` 소개
- `/aeroponics` 에어포닉스
- `/planting` 식재 가이드
- `/pickup-guide` 픽업 안내
- `/returns` 교환·반품
- `/privacy` 개인정보처리방침
- `/order-lookup` 주문 조회

## Implementation

1. **New build script** `scripts/generate-rss.ts`
   - Mirrors the pattern of `scripts/generate-sitemap.ts`.
   - Imports variant data inline (re-declare the same 4 variants to avoid pulling image assets into a Node script — same approach as the sitemap's hardcoded handle list).
   - Writes `public/rss.xml` as RSS 2.0 with channel metadata:
     - `<title>` 나무와 걷는 시간
     - `<link>` https://timewithtree.co.kr
     - `<description>` 잭큐몬티 자작나무 농장 소식 및 상품
     - `<language>` ko-kr
     - `<atom:link href="https://timewithtree.co.kr/rss.xml" rel="self" type="application/rss+xml" />`
   - Products listed first, then pages.
   - Escapes `&`, `<`, `>` in titles/descriptions; wraps descriptions in `<![CDATA[...]]>`.

2. **Wire into build** — `package.json`
   - Add `predev` and `prebuild` to also run `tsx scripts/generate-rss.ts` (alongside the existing sitemap generator). `public/rss.xml` is then served at `/rss.xml` by Vite automatically.

3. **Discovery tag** — `index.html`
   - Add inside `<head>`:
     ```html
     <link rel="alternate" type="application/rss+xml" title="나무와 걷는 시간 RSS" href="/rss.xml" />
     ```

4. **robots.txt** — `public/robots.txt`
   - Append a second discovery hint line: `Sitemap` already exists; RSS isn't a standard robots directive, so no change required there. (Naver discovers RSS via the dashboard submission + the `<link rel="alternate">` tag.)

## What you give Naver
- Submit URL in Naver Search Advisor → **RSS 제출**: `https://timewithtree.co.kr/rss.xml`

## Out of scope
- No new admin UI, no dynamic feed (it's regenerated at build time, same as the sitemap).
- No changes to product data, routing, or auth.

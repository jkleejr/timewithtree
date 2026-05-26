## Shop page updates

Two changes to `src/components/ShopBrowser.tsx` (the 구매하기 page):

### 1. Top heading: "잭큐몬티 자작나무"
Replace the current page title "구매하기" at the very top with **"잭큐몬티 자작나무"**, matching the reference. The duplicate "잭큐몬티 자작나무" heading currently shown above the variant list (right column) will be removed since it would now be redundant.

### 2. Red "용달" badge before each price
In every variant row in the product list, add a small red outlined box containing the text **용달** immediately to the left of the price (e.g. `[용달] 40,000원`). Styled with a red border + red text on white background, compact padding, matching the reference screenshot.

### Technical notes
- File: `src/components/ShopBrowser.tsx` only
- Title change: update the `<h1>` in the header block (and the `title` default prop) to "잭큐몬티 자작나무"; delete the right-column `<h2>잭큐몬티 자작나무</h2>`
- Badge: inline `<span>` with `border border-red-600 text-red-600 text-xs px-1.5 py-0.5` next to the price span
- No backend/data changes
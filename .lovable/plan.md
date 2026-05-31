## Goal

On the homepage hero gallery ("잭큐몬티 자작나무 농장"), improve image sharpness on full-screen displays and slightly shift the 1st and 4th images so a bit more of the top is visible.

## Findings

The hero source images are only ~1368–1476 px wide:
- `hero-main-1.jpg` 1368×1824
- `hero-main-3.jpg` 1368×1824
- `hero-birch-2.png` 1476×1408
- `hero-birch-4.png` 1474×1046
- `hero-birch-5.png` 1476×1402

The `<img>` tag declares `width={1920} height={1280}` and the container stretches full-width with `object-cover`. On large monitors the browser upscales these source files, which is why they look soft. The image size on screen will not change — only how crisply it renders.

## Plan

### 1. Regenerate the 5 hero images at higher resolution

Use the image generation tool to recreate each hero image at 1920×1280 (matching the declared size and the 16:8 aspect of the hero), preserving subject and composition as closely as possible. Overwrite the existing files in `src/assets/` so no import changes are needed.

If the user prefers not to regenerate (since AI regen can shift composition slightly), an alternative is to keep current files and just accept the soft rendering — but visual quality cannot improve without higher-resolution sources.

### 2. Shift the 1st and 4th images down slightly (show more top)

In `src/pages/Index.tsx`, the hero map renders each image with `object-cover`. Add a per-image `objectPosition` so images 1 and 4 (indexes 0 and 3 — `hero-main-1` and `hero-birch-4`) render with `object-position: center 35%` instead of the default `center center`. This shifts the visible window upward, revealing a little more of the top of the photo. The other three images keep the default centering.

This is a tiny CSS-only change, no layout shift, image size unchanged.

## Technical details

- File touched: `src/pages/Index.tsx` — add `style={{ objectPosition: i === 0 || i === 3 ? "center 35%" : "center center" }}` (or equivalent Tailwind `object-[center_35%]`) on the hero `<img>`.
- Asset regen: 5 calls to the image generator at 1920×1280, overwriting existing filenames.
- No changes to imports, layout, container sizing, or responsive behavior.

## Open question

Do you want me to regenerate the 5 hero photos at higher resolution (composition may shift very slightly), or skip the regen and only apply the position shift?

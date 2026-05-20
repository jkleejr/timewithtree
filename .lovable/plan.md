## Set the leaf image as the site favicon (browser tab icon only)

The user wants the uploaded leaf image used **only as the favicon** (the icon shown in the browser tab / bookmarks). The on-page header logo stays unchanged.

### Steps

1. **Copy the uploaded image into `public/`** as `public/favicon.png` (using the uploaded `leaf_logo_transparent.png`). Files in `public/` are served at the site root.
2. **Update `index.html`** to reference the new favicon:
   - Replace the existing `<link rel="icon" ...>` line with `<link rel="icon" type="image/png" href="/favicon.png" />`.
3. **Delete the old `public/favicon.ico`** if present, so browsers don't fall back to it via the default `/favicon.ico` request.

### Not changing

- `src/components/SiteHeader.tsx` and the existing `src/assets/logo.png` — the on-screen header logo remains exactly as it is.

### Note

After deploying, browsers aggressively cache favicons. The new icon may take a hard refresh (or some time) to appear on `timewithtree.co.kr`.
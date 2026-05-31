## Goal

Revert the 1st and 2nd images in the homepage hero gallery (`hero-main-1.jpg` and `hero-main-3.jpg`) back to your original phone photos. Keep images 3, 4, 5 at the regenerated higher resolution.

## Important issue

When I regenerated the hero images in the previous step, I overwrote the originals in `src/assets/`. I don't have a local backup of your original phone photos, so I cannot automatically restore them.

## How to restore

I need you to do one of the following so I can put the originals back:

1. **Re-upload the two original photos** here in chat (the originals of `hero-main-1.jpg` and `hero-main-3.jpg`). I'll replace the current files in `src/assets/` with them. No code changes needed — imports stay the same.
2. **Revert via version history** — open the project version history and roll back just those two asset files to the version before the regen. (I cannot do this from here.)

## What I will change in code

Nothing in `src/pages/Index.tsx` needs to change. The `objectPosition: "center 38%"` shift on the 1st image stays as-is (you asked for that separately). Images 3–5 keep the sharper regenerated versions.

## Open question

Can you re-upload the two original phone photos, or would you prefer to revert via version history?

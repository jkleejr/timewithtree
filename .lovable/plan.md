# Plan - Align Hero text on mobile

We will adjust the horizontal padding of the hero/intro overlay in the homepage so that the text aligns perfectly with the subsequent section ("자작나무 소개") on mobile devices.

## Proposed Changes

### `src/pages/Index.tsx`

Change the padding classes of the introductory overlay container from:
```tsx
className="relative md:absolute md:inset-0 z-[5] max-w-7xl mx-auto px-12 sm:px-6 md:px-10 py-8 md:py-16 flex flex-col gap-4 sm:gap-6 md:gap-8 pointer-events-none min-h-full"
```
to:
```tsx
className="relative md:absolute md:inset-0 z-[5] max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-16 flex flex-col gap-4 sm:gap-6 md:gap-8 pointer-events-none min-h-full"
```

## Technical Notes

- The subsequent section (`#about`) uses `px-6 md:px-10` for its container padding.
- The hero intro overlay was using `px-12 sm:px-6 md:px-10`, which caused it to have `px-12` (48px) on mobile instead of `px-6` (24px), shifting the text slightly to the right relative to other sections.
- Changing it to `px-6 md:px-10` ensures consistent alignment across all screen widths.

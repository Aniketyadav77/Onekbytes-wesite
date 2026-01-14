# Replace MVP Image

## Quick Fix: Add Your Image

1. **Save your image as**: `public/images/mvp-image.png`
2. **Recommended size**: 400×300 pixels (or maintain 4:3 aspect ratio)
3. **Format**: PNG with transparent background works best

## Current Status

- ✅ **Rotating animation**: Ready and working
- ✅ **Hover effects**: Speed-up on hover 
- ✅ **Fallback display**: Shows placeholder with robot emoji if image missing
- 🔄 **Image file**: Need to add your actual PNG

## Test It

```bash
npm run dev
# Visit http://localhost:3000/mvp
```

You'll see either:
- **Your image** (if mvp-image.png exists) - rotating with hover effects
- **Placeholder** (if missing) - shows 🤖 "AI Edge Device" with "Replace mvp-image.png" text

## Customize

- **Rotation speed**: Edit `.animate-rotate-slow` in `src/app/globals.css`
- **Image size**: Change `width={400} height={300}` in `src/app/mvp/page.tsx`
- **Position**: Image appears on the right side of the hero section

## Alternative: Use Different Path

If you want to use a different image path, edit this line in `src/app/mvp/page.tsx`:

```tsx
src="/images/mvp-image.png"  // Change to your path
```
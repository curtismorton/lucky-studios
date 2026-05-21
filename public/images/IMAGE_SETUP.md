# Image Setup

Use this guide when adding or replacing images.

## Directory convention

- Keep all image assets in `public/images`
- Keep hero assets in `public/images/hero`
- Use lowercase kebab-case filenames (no spaces)

## Current hero filenames expected by code

- `hero-1682-2.jpg`
- `hero-1980.jpg`
- `hero-2104-copy.jpg`
- `hero-2104.jpg`
- `hero-2171-copy.jpg`
- `hero-2171.jpg`
- `hero-2771-2.jpg`
- `hero-2771-3.jpg`
- `hero-2771.jpg`

## Verification

Before deploy, run:

```bash
npm run check:launch
```

If it reports missing image files, either:
1. Add the missing file to `public/images/...`, or
2. Update the code path to match the real filename.

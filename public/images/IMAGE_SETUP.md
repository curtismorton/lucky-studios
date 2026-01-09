# Image Setup Guide

## Required Images for Home Page

The following images need to be added to `/public/images/` for the home page to display correctly:

### BTS Background Images (Hero Section)
These images are used in the animated background grid:
- `Pod_shots_-07__1_.jpg` - Podcast recording
- `Set_Shots-11__3_.jpg` - Studio setup
- `Pod_shots_-17__1_.jpg` - Recording session
- `ROW08557.jpg` - Behind the scenes
- `Group_thumb-29.jpg` - Team photo

### Transformation Section Images
These images are used in the "Raw to Polished" transformation slider:

**Back Post:**
- `Group_thumb-29.jpg` - Raw photoshoot (reused from BTS)
- `COVER-ART__1_.png` - Final cover art

**Don't Get Me Started:**
- `ROW08813.jpg` - Raw photoshoot
- `VER1__1_.png` - Final cover art

### Featured Show Card
- `COVER-ART__1_.png` - Back Post cover art (reused from transformation section)

## How to Add Images

1. **Copy images from your local folder:**
   ```bash
   # If images are in Downloads
   cp "/Users/Curtis/Downloads/files (1)/lucky-studios-site/images/"*.{jpg,png} /Users/Curtis/DEV/public/images/
   ```

2. **Or manually copy via Finder:**
   - Navigate to your source images folder
   - Copy all required image files
   - Paste them into `/Users/Curtis/DEV/public/images/`

3. **Verify images are added:**
   ```bash
   ls -la /Users/Curtis/DEV/public/images/
   ```

4. **Commit images to git:**
   ```bash
   git add public/images/
   git commit -m "Add home page images"
   git push
   ```

## Image Requirements

- **Format:** JPG or PNG
- **Naming:** Use exact filenames as listed above (case-sensitive)
- **Size:** Optimize images before adding (recommended: max 2MB per image)
- **Dimensions:** 
  - BTS images: Any aspect ratio (will be cropped)
  - Cover art: Square or 1:1 ratio recommended
  - Raw photoshoot: Any aspect ratio

## Fallback Behavior

The code includes fallback gradients when images fail to load, so the site will still function without these images, but the visual design will be incomplete.


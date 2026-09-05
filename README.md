# Opeyemi — Video Editor Portfolio

A dark-first, glassmorphic portfolio site built with plain HTML, CSS and vanilla JS — no frameworks.

## Structure

```
index.html
style.css
script.js
assets/
  videos/      ← drop your real .mp4 files here
  thumbnails/  ← poster images for each video (currently gradient placeholders)
  images/      ← about photo + social share image
```

## Replacing placeholder content

**Videos** — Add these files to `assets/videos/` with these exact names, or edit the `src` /
`data-src` attributes in `index.html` and the `projects` array in `script.js` if you rename them:

- `showreel.mp4` — hero showreel
- `real-estate-reel.mp4`
- `podcast-short.mp4`
- `talking-head.mp4`
- `product-promo.mp4`
- `youtube-short.mp4`
- `cinematic-edit.mp4`

Videos are not fetched until needed — the hero reel loads on `preload="metadata"`, and each
portfolio card only attaches its video source on first hover (desktop) or when opened in the
modal, so nothing heavy downloads on page load.

**Thumbnails** — Replace the files in `assets/thumbnails/` (same names, `.jpg`) with real
frame grabs from each video. These are currently generated gradient placeholders so the layout
renders correctly before you add real media.

**About photo** — Replace `assets/images/about-placeholder.jpg`.

**Social preview image** — Replace `assets/images/og-cover.jpg` (1200×630 recommended).

## Contact form

The form in the Contact section is front-end only. To wire it up:

1. Sign up at [Formspree](https://formspree.io) (or a similar service).
2. Add `action="https://formspree.io/f/yourFormId"` and `method="POST"` to the `<form id="contactForm">` tag, **or**
3. Replace the `submit` handler in `script.js` (`initForm`) with a `fetch()` call to your endpoint.

## Theme

Colors live as CSS variables at the top of `style.css` under `:root` (dark) and
`[data-theme="light"]` (light). Change `--accent` to re-theme the whole site.

## Browser support

Uses `backdrop-filter`, CSS custom properties, and Intersection Observer — supported in all
current major browsers. Reduced-motion and touch-device fallbacks are built in.

# Benchboat Games Website — How To Use

This guide is the quick reference for maintaining the site. It covers blog posts, the generator scripts, and where to change colors, textures, and fonts.

---

## 1) Making a new blog post (simple HTML)

**Folder structure (one post per folder):**
```
Blog/YYYY/MM/DD/
  your_post.html
  banner_YYYY_MM_DD.png
  blogpostMedia1_YYYY_MM_DD.png
  (any other images or gifs)
```

**Steps:**
1. Copy an existing post folder (e.g., `Blog/2026/02/04/`) and rename the folder path to your new date.
2. Rename the HTML file to match your date (example: `2026_05_12.html`).
3. Update these fields inside the HTML:
   - `<h1>` — post title
   - `<p class="blog-post-date">` — post date
   - First regular `<p>` — this becomes the **summary** shown on the blog overview page
   - `<img class="blog-post-banner" ...>` — banner image at the top of the post
4. Place any images or GIFs next to the HTML and reference them with relative paths.

**GIFs** will auto‑play in the browser as long as the file is referenced in an `<img>` tag.

---

## 2) Regenerating the blog overview page

The blog overview (`Blog/index.html`) is **generated** from your post HTML files.

**Run this from the repo root:**
```bash
scripts/generate_blog_index.sh
```

**What the script does:**
- Finds all `Blog/**/` HTML files (excluding `Blog/index.html`)
- Reads each post’s:
  - `<h1>` title
  - `.blog-post-date`
  - First normal paragraph (`<p>` not marked as the date)
  - Banner image (`.blog-post-banner`)
- Rewrites `Blog/index.html` with a card for each post

After running it, **commit and push** the updated `Blog/index.html`.

---

## 3) Changing colors

Core palette lives at the top of `styles.css`:
```css
:root {
  --bench-black: #16150F;
  --bench-yellow: #F4CE0C;
  --bench-white: #F5F2EA;
  --bench-retro: #D09B1D;
}
```

**Page themes are set by page class:**
- `body.main-page` (home)
- `body.blog-page` (blog overview)
- `body.blog-post-page` (blog posts)
- `body.liminal-page`, `body.about-page`, `body.choss-page`

Search in `styles.css` for the relevant page class and update `--bg-color`, `--text-color`, etc.

---

## 4) Changing textures

Textures are set in `styles.css`:
```css
:root {
  --bench-texture: url("Graphics/texture.png");
}
```

**Overrides:**
- Home page uses `Graphics/texture2.png` via `body.main-page::before`.

To change the texture, replace the PNG file or update the CSS variable.

---

## 5) Fonts (headings vs body)

**Headings / nav** use the pixel font.
**Blog body text** uses IBM Plex Mono for readability.

Font settings live in `styles.css`:
- `.nav a`
- `.blog-post-container p`
- `.blog-post-meta p`

If you want a different body font, change these selectors.

---

## 6) Main page click-through

The animated boat link on the home page is controlled in `index.html`:
```html
<a href="/About/index.html" id="animated-link">
```

Change that `href` to point anywhere you want.

---

## 7) Keeping this guide updated

Whenever we change how a system works (blog posts, colors, scripts, etc.), we will update this file (`HOW_TO_USE.md`) so you always have a single source of truth.

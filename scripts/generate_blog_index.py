#!/usr/bin/env python3
import re
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent
BLOG = ROOT / "Blog"


def walk_posts():
    files = []
    for p in BLOG.rglob("*"):
        if p.is_file() and p.suffix.lower() in {".html", ".htm"} and p.name.lower() != "index.html":
            files.append(p)
    return files


def strip_tags(text: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", text)).strip()


def first_match(content: str, pattern: str) -> str:
    m = re.search(pattern, content, re.IGNORECASE | re.DOTALL)
    return m.group(1).strip() if m else ""


def resolve_url(file_path: Path, src: str) -> str:
    if not src:
        return ""
    if src.startswith("/"):
        return src
    return "/" + str((file_path.parent / src).resolve().relative_to(ROOT)).replace("\\", "/")


def parse_date(date_text: str):
    if not date_text:
        return None
    for fmt in ["%B %d, %Y", "%b %d, %Y", "%Y-%m-%d", "%m/%d/%Y"]:
        try:
            return datetime.strptime(date_text, fmt)
        except ValueError:
            pass
    try:
        return datetime.fromisoformat(date_text)
    except ValueError:
        return None


def date_from_path(file_path: Path) -> str:
    rel = file_path.relative_to(BLOG).as_posix()
    m = re.match(r"^(\d{4})/(\d{2})/(\d{2})/", rel)
    if not m:
        return ""
    d = datetime(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    return d.strftime("%B %-d, %Y") if hasattr(d, 'strftime') else d.strftime("%B %d, %Y")


def find_banner_fallback(file_path: Path) -> str:
    for f in sorted(file_path.parent.iterdir()):
        if f.is_file() and re.match(r"^banner_", f.name, re.IGNORECASE):
            return "/" + str(f.resolve().relative_to(ROOT)).replace("\\", "/")
    return ""


def first_paragraph(content: str) -> str:
    for m in re.finditer(r"<p[^>]*>([\s\S]*?)</p>", content, re.IGNORECASE):
        raw = m.group(0)
        if "blog-post-date" in raw.lower():
            continue
        text = strip_tags(m.group(1))
        if text:
            return text
    return ""


def build_post_data(file_path: Path):
    content = file_path.read_text(encoding="utf-8", errors="ignore")

    title = (
        strip_tags(first_match(content, r"<h1[^>]*>([\s\S]*?)</h1>"))
        or strip_tags(first_match(content, r"<title[^>]*>([\s\S]*?)</title>"))
        or file_path.stem
    )

    date_text = (
        strip_tags(first_match(content, r'class=["\'][^"\']*blog-post-date[^"\']*["\'][^>]*>([\s\S]*?)</[^>]+>'))
        or strip_tags(first_match(content, r"<time[^>]*>([\s\S]*?)</time>"))
        or date_from_path(file_path)
    )

    desc = first_paragraph(content) or "New post update."

    explicit_banner = (
        first_match(content, r'class=["\'][^"\']*blog-post-banner[^"\']*["\'][^>]*src=["\']([^"\']+)["\']')
        or first_match(content, r"<img[^>]*src=[\"']([^\"']+)[\"'][^>]*>")
    )

    banner = resolve_url(file_path, explicit_banner) or find_banner_fallback(file_path)

    return {
        "title": title,
        "date_text": date_text,
        "description": desc,
        "url_path": "/" + str(file_path.resolve().relative_to(ROOT)).replace("\\", "/"),
        "banner_url": banner,
        "sort_date": parse_date(date_text),
    }


posts = [build_post_data(p) for p in walk_posts()]
posts.sort(key=lambda p: (p["sort_date"] is None, -(p["sort_date"].timestamp()) if p["sort_date"] else 0, p["title"]))

cards = []
for post in posts:
    img = f'<img src="{post["banner_url"]}" alt="{post["title"]} banner">' if post["banner_url"] else ""
    cards.append(
        f'''\n                <a class="blog-post-card" href="{post["url_path"]}">\n                    {img}\n                    <div class="blog-post-meta">\n                        <h2>{post["title"]}</h2>\n                        <p>{post["description"]}</p>\n                        <span>{post["date_text"] or "Date coming soon"}</span>\n                    </div>\n                </a>'''
    )

html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - Benchboat Games</title>
    <link rel="stylesheet" href="../styles.css">
    <script src="../nav.js" defer></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Antonio:wght@100..700&family=Micro+5&family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">
</head>
<body class="blog-page">
    <main class="blog-container">
        <div class="blog-surface">
            <header class="blog-hero">
                <h1>Benchboat Dev Blog</h1>
                <p>Updates, screenshots, and behind-the-scenes notes.</p>
            </header>
            <section class="blog-post-list">{''.join(cards)}
            </section>
        </div>
    </main>
</body>
</html>
'''

(BLOG / "index.html").write_text(html, encoding="utf-8")
print(f"Generated Blog/index.html with {len(posts)} post(s).")
for post in posts:
    warn = []
    if not post["banner_url"]:
        warn.append("no banner detected")
    if not post["date_text"]:
        warn.append("no date detected")
    if warn:
        print(f"Warning: {post['url_path']} -> {', '.join(warn)}")

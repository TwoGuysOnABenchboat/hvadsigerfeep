const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const blogDir = path.join(rootDir, "Blog");

const walkHtmlFiles = (dir, files = []) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(fullPath, files);
    } else if (entry.isFile()) {
      const lower = entry.name.toLowerCase();
      if ((lower.endsWith(".html") || lower.endsWith(".htm")) && lower !== "index.html") {
        files.push(fullPath);
      }
    }
  }
  return files;
};

const stripTags = (value) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const getFirstMatch = (content, regex) => {
  const match = content.match(regex);
  return match ? match[1].trim() : "";
};

const resolveUrl = (filePath, src) => {
  if (!src) return "";
  if (src.startsWith("/")) return src;
  const postDir = path.dirname(filePath);
  const relativePath = path.relative(rootDir, path.join(postDir, src));
  return `/${relativePath.replace(/\\/g, "/")}`;
};

const parseDate = (dateText) => {
  const parsed = Date.parse(dateText);
  if (!Number.isNaN(parsed)) return new Date(parsed);
  return null;
};

const dateFromPath = (filePath) => {
  const rel = path.relative(blogDir, filePath).replace(/\\/g, "/");
  const m = rel.match(/^(\d{4})\/(\d{2})\/(\d{2})\//);
  if (!m) return "";
  const d = new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const findBannerFallback = (filePath) => {
  const postDir = path.dirname(filePath);
  const files = fs.readdirSync(postDir);
  const banner = files.find((name) => /^banner_/i.test(name));
  if (!banner) return "";
  return resolveUrl(filePath, banner);
};

const firstParagraph = (content) => {
  const regex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const rawP = match[0];
    if (/blog-post-date/i.test(rawP)) continue;
    const text = stripTags(match[1]);
    if (text) return text;
  }
  return "";
};

const buildPostData = (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");

  const title =
    stripTags(getFirstMatch(content, /<h1[^>]*>([\s\S]*?)<\/h1>/i)) ||
    stripTags(getFirstMatch(content, /<title[^>]*>([\s\S]*?)<\/title>/i)) ||
    path.basename(filePath, path.extname(filePath));

  const dateText =
    stripTags(getFirstMatch(content, /class=["'][^"']*blog-post-date[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i)) ||
    stripTags(getFirstMatch(content, /<time[^>]*>([\s\S]*?)<\/time>/i)) ||
    dateFromPath(filePath);

  const description = firstParagraph(content) || "New post update.";

  const explicitBanner =
    getFirstMatch(content, /class=["'][^"']*blog-post-banner[^"']*["'][^>]*src=["']([^"']+)["']/i) ||
    getFirstMatch(content, /<img[^>]*src=["']([^"']+)["'][^>]*>/i);

  const bannerUrl = resolveUrl(filePath, explicitBanner) || findBannerFallback(filePath);

  const urlPath = `/${path.relative(rootDir, filePath).replace(/\\/g, "/")}`;

  return {
    title,
    dateText,
    description,
    urlPath,
    bannerUrl,
    sortDate: parseDate(dateText),
  };
};

const posts = walkHtmlFiles(blogDir).map(buildPostData);

posts.sort((a, b) => {
  if (a.sortDate && b.sortDate) return b.sortDate - a.sortDate;
  if (a.sortDate) return -1;
  if (b.sortDate) return 1;
  return a.title.localeCompare(b.title);
});

const postCards = posts
  .map(
    (post) => `\n                <a class="blog-post-card" href="${post.urlPath}">\n                    ${post.bannerUrl ? `<img src="${post.bannerUrl}" alt="${post.title} banner">` : ""}\n                    <div class="blog-post-meta">\n                        <h2>${post.title}</h2>\n                        <p>${post.description}</p>\n                        <span>${post.dateText || "Date coming soon"}</span>\n                    </div>\n                </a>`
  )
  .join("\n");

const html = `<!DOCTYPE html>
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
            <section class="blog-post-list">${postCards}
            </section>
        </div>
    </main>
</body>
</html>
`;

fs.writeFileSync(path.join(blogDir, "index.html"), html);
console.log(`Generated Blog/index.html with ${posts.length} post(s).`);
for (const post of posts) {
  const warn = [];
  if (!post.bannerUrl) warn.push("no banner detected");
  if (!post.dateText) warn.push("no date detected");
  if (warn.length) {
    console.log(`Warning: ${post.urlPath} -> ${warn.join(", ")}`);
  }
}

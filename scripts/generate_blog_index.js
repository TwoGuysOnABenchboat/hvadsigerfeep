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
        } else if (entry.isFile() && entry.name.endsWith(".html") && entry.name !== "index.html") {
            files.push(fullPath);
        }
    }
    return files;
};

const stripTags = (value) => value.replace(/<[^>]+>/g, "").trim();

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
    if (!Number.isNaN(parsed)) {
        return new Date(parsed);
    }
    return null;
};

const buildPostData = (filePath) => {
    const content = fs.readFileSync(filePath, "utf8");
    const title = stripTags(getFirstMatch(content, /<h1[^>]*>([\s\S]*?)<\/h1>/i));
    const dateText = stripTags(getFirstMatch(content, /class="blog-post-date"[^>]*>([\s\S]*?)<\/p>/i));
    const description = stripTags(
        getFirstMatch(content, /<p(?![^>]*blog-post-date)[^>]*>([\s\S]*?)<\/p>/i)
    );
    const bannerSrc = getFirstMatch(content, /class="blog-post-banner"[^>]*src="([^"]+)"/i);
    const urlPath = `/${path.relative(rootDir, filePath).replace(/\\/g, "/")}`;
    return {
        title,
        dateText,
        description,
        urlPath,
        bannerUrl: resolveUrl(filePath, bannerSrc),
        sortDate: parseDate(dateText),
    };
};

const posts = walkHtmlFiles(blogDir).map(buildPostData);

posts.sort((a, b) => {
    if (a.sortDate && b.sortDate) {
        return b.sortDate - a.sortDate;
    }
    if (a.sortDate) return -1;
    if (b.sortDate) return 1;
    return a.title.localeCompare(b.title);
});

const postCards = posts
    .map(
        (post) => `
                <a class="blog-post-card" href="${post.urlPath}">
                    <img src="${post.bannerUrl}" alt="${post.title} banner">
                    <div class="blog-post-meta">
                        <h2>${post.title}</h2>
                        <p>${post.description}</p>
                        <span>${post.dateText}</span>
                    </div>
                </a>`
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
            <section class="blog-post-list">
${postCards}
            </section>
        </div>
    </main>
</body>
</html>
`;

fs.writeFileSync(path.join(blogDir, "index.html"), html);
console.log(`Generated Blog/index.html with ${posts.length} post(s).`);

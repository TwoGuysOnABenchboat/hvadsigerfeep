document.addEventListener("DOMContentLoaded", () => {
    const postList = document.querySelector(".blog-post-list");
    const postArticle = document.querySelector(".blog-post-article");

    if (postArticle) {
        const orderedPostPaths = ['/Blog/2026/02/09/2026_09_02.html', '/Blog/2026/02/05/2026_05_02.html', '/Blog/2026/02/04/2026_04_02.html', '/Blog/2026/02/03/2026_03_02.html'];
        const postPath = window.location.pathname;
        const normalizedPostPath = postPath.toLowerCase();
        const normalizedOrdered = orderedPostPaths.map((path) => path.toLowerCase());

        const currentIndex = normalizedOrdered.indexOf(normalizedPostPath);
        if (currentIndex !== -1) {
            const nav = document.createElement("div");
            nav.className = "blog-post-nav";

            const prevPath = orderedPostPaths[currentIndex + 1];
            if (prevPath) {
                const prevLink = document.createElement("a");
                prevLink.className = "blog-post-nav-link blog-post-nav-prev";
                prevLink.href = prevPath;
                prevLink.setAttribute("aria-label", "Previous post");
                prevLink.textContent = "← Prev";
                nav.appendChild(prevLink);
            }

            const nextPath = orderedPostPaths[currentIndex - 1];
            if (nextPath) {
                const nextLink = document.createElement("a");
                nextLink.className = "blog-post-nav-link blog-post-nav-next";
                nextLink.href = nextPath;
                nextLink.setAttribute("aria-label", "Next post");
                nextLink.textContent = "Next →";
                nav.appendChild(nextLink);
            }

            if (nav.childElementCount > 0) {
                postArticle.insertAdjacentElement("afterbegin", nav);
            }
        }

        return;
    }

    if (!postList) return;

    const allPosts = Array.from(postList.querySelectorAll(".blog-post-card"));
    if (allPosts.length === 0) return;

    const postsPerPage = 10;
    let sortDirection = "newest";
    let currentPage = 1;

    const controls = document.createElement("div");
    controls.className = "blog-controls";
    controls.innerHTML = `
        <label for="blog-sort">Sort:</label>
        <select id="blog-sort" aria-label="Sort blog posts">
            <option value="newest">Newest to oldest</option>
            <option value="oldest">Oldest to newest</option>
        </select>
    `;

    const pagination = document.createElement("div");
    pagination.className = "blog-pagination";

    postList.insertAdjacentElement("beforebegin", controls);
    postList.insertAdjacentElement("afterend", pagination);

    const parsePostDate = (post) => {
        const dateEl = post.querySelector(".blog-post-meta span");
        if (!dateEl) return 0;
        const parsed = Date.parse(dateEl.textContent.trim());
        return Number.isNaN(parsed) ? 0 : parsed;
    };

    const sortedPosts = () => {
        const clone = [...allPosts];
        clone.sort((a, b) => {
            const diff = parsePostDate(b) - parsePostDate(a);
            return sortDirection === "newest" ? diff : -diff;
        });
        return clone;
    };

    const renderPagination = (totalPages) => {
        pagination.innerHTML = "";
        if (totalPages <= 1) return;

        const prev = document.createElement("button");
        prev.type = "button";
        prev.textContent = "← Prev";
        prev.disabled = currentPage === 1;
        prev.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage -= 1;
                render();
            }
        });

        const pageInfo = document.createElement("span");
        pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;

        const next = document.createElement("button");
        next.type = "button";
        next.textContent = "Next →";
        next.disabled = currentPage === totalPages;
        next.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage += 1;
                render();
            }
        });

        pagination.append(prev, pageInfo, next);
    };

    const render = () => {
        const ordered = sortedPosts();
        const totalPages = Math.max(1, Math.ceil(ordered.length / postsPerPage));
        if (currentPage > totalPages) currentPage = totalPages;

        const startIndex = (currentPage - 1) * postsPerPage;
        const pagePosts = ordered.slice(startIndex, startIndex + postsPerPage);

        postList.innerHTML = "";
        for (const post of pagePosts) {
            postList.appendChild(post);
        }

        renderPagination(totalPages);
    };

    document.getElementById("blog-sort").addEventListener("change", (event) => {
        sortDirection = event.target.value;
        currentPage = 1;
        render();
    });

    render();
});

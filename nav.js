document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname.toLowerCase();
    const isBlogIndex = ["/blog", "/blog/", "/blog/index.html"].includes(currentPath);

    const navbar = `
        <div class="nav-bar"></div>
        <div class="nav">
            ${currentPath !== "/" ? `<a class="nav-link" href="/">Home</a>` : ""}
            ${!currentPath.includes("/liminalbrutalis") ? `<a class="nav-link" href="/LiminalBrutalis">Liminal Brutalis</a>` : ""}
            ${!isBlogIndex ? `<a class="nav-link" href="/Blog">Blog</a>` : ""}
            ${!currentPath.includes("/about") ? `<a class="nav-link" href="/About">About</a>` : ""}
        </div>
    `;

    const socialBar = `
        <div class="social-bar" aria-label="Benchboat social links">
            <a class="social-link" href="https://x.com/BenchBoatGames" target="_blank" rel="noopener noreferrer" aria-label="X">X</a>
            <a class="social-link" href="https://www.linkedin.com/company/bench-boat-games" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a>
            //<a class="social-link" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
        </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", navbar);
    document.body.insertAdjacentHTML("beforeend", socialBar);
});

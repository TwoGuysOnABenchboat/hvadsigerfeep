document.addEventListener("DOMContentLoaded", function () {
    let currentPath = window.location.pathname.toLowerCase();

    let navbar = `
        <div class="nav-bar"></div>
        <div class="nav">
            ${currentPath !== "/" ? `<a class="nav-link" href="/">Home</a>` : ""}
            ${!currentPath.includes("/liminalbrutalis") ? `<a class="nav-link" href="/LiminalBrutalis">Liminal Brutalis</a>` : ""}
            ${!currentPath.includes("/blog") ? `<a class="nav-link" href="/Blog">Blog</a>` : ""}
            ${!currentPath.includes("/about") ? `<a class="nav-link" href="/About">About</a>` : ""}
        </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", navbar);
});

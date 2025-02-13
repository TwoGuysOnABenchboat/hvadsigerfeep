document.addEventListener("DOMContentLoaded", function () {
    let pathPrefix = window.location.pathname.includes("/Choss") || window.location.pathname.includes("/About") ? "../" : "";
    let currentPath = window.location.pathname.toLowerCase();

    let navbar = `
        <div class="nav-bar"></div> 
        <div class="nav">
            ${currentPath !== "/" ? `<a href="/"><img src="${pathPrefix}Graphics/Tabs/home.png" alt="Home"></a>` : ""}
            ${!currentPath.includes("/choss") ? `<a href="/Choss"><img src="${pathPrefix}Graphics/Tabs/choss.png" alt="Choss"></a>` : ""}
            ${!currentPath.includes("/about") ? `<a href="/About"><img src="${pathPrefix}Graphics/Tabs/about.png" alt="About"></a>` : ""}
        </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", navbar);
});

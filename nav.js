document.addEventListener("DOMContentLoaded", function () {
    // Detect if the page is in a subdirectory
    let pathPrefix = window.location.pathname.includes("/Choss") || window.location.pathname.includes("/About") ? "../" : "";

    let navbar = `
        <div class="nav">
            <a href="/"><img src="${pathPrefix}Graphics/Tabs/home.png" alt="Home"></a>
            <a href="/Choss/index.html"><img src="${pathPrefix}Graphics/Tabs/choss.png" alt="Choss"></a>
            <a href="/About/index.html"><img src="${pathPrefix}Graphics/Tabs/about.png" alt="About"></a>
        </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", navbar);
});

document.addEventListener("DOMContentLoaded", function () {
    let pathPrefix = window.location.pathname.includes("/Choss") || window.location.pathname.includes("/About") ? "../" : "";

    let navbar = `
        <div class="nav-bar"></div> <!-- This is the background bar -->
        <div class="nav">
            <a href="/"><img src="${pathPrefix}Graphics/Tabs/home.png" alt="Home"></a>
            <a href="/Choss"><img src="${pathPrefix}Graphics/Tabs/choss.png" alt="Choss"></a>
            <a href="/About"><img src="${pathPrefix}Graphics/Tabs/about.png" alt="About"></a>
        </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", navbar);
});

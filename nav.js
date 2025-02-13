document.addEventListener("DOMContentLoaded", function () {
    let navbar = `
        <div class="nav">
            <a href="/"><img src="Graphics/Tabs/home.png" alt="Home"></a>
            <a href="/Choss/"><img src="Graphics/Tabs/choss.png" alt="Choss"></a>
            <a href="/About/"><img src="Graphics/Tabs/about.png" alt="About"></a>
        </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", navbar);
});

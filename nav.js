document.addEventListener("DOMContentLoaded", function () {
    let navbar = `
        <div class="nav">
            <a href="/"><img src="Graphics/Tabs/Home.png" alt="Home"></a>
            <a href="/Choss/"><img src="Graphics/Tabs/Choss.png" alt="Choss"></a>
            <a href="/About/"><img src="Graphics/Tabs/About.png" alt="About"></a>
        </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", navbar);
});

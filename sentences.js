const crypto = require('crypto');

function getRandomSentence() {
    const sentences = [
        "I HAVE ALWAYS BEEN A GOOD BOY AND I DARE YOU PROVE OTHERWISE",
        "I would rather die",
        "I'm not out here trying to convince you to commodify your hobby",
        "If I can't make it easy, I won't do it",
        "The harder you make it for yourself, the more life sucks",
        "You fucking idiot. You absolute moron. You stupid guy. Fish can't walk",
        "DINNER IS SERVED",
        "I HAVE FLOATED IN THE LIMINAL VOID FOR 5 YEARS",
        "NO ONE HAS DONE AS MUCH NOTHING AS ME",
        "Faren ved preorder er",
        "Vareulv, Vareulv, Vareulv er sej ",
        " so i have had to learn to agree to disagree",
        "i have singlehandedly ruined many a social event in my pursuit of this",
        "Kender I det hvor man befamler folk til sit eget bryllup og pludselig kommer en patruljevogn op til havelågen",
        "det go skum",
        "irony is just something mean people think is comedy :'((((",
        "if you're dumb enough to try something dumb, then you're simultaneously too dumb to succeed",
        "THEY SAID I WAS MAD. THEY SAID MY TINFOIL HAT WAS A LITTLE TOO TIGHT",
        "It's a man teaching another man to fish, only to have that other man fish all the fish and put them in fish tanks he owns Now, there's cheap fish for everyone, and everyone is happy - except the fishermen, who somehow ended up with no fish, despite being integral to the filling of the fish tanks",
        "My name is Phlip Flopmand",
        "you helped make the world a better place, but not for you",
        "the pornhub comment section is a social medium of its own. And a wholesome one at that",
        "jeg er overbevist om du har fundet en vandmand på størrelse med spanien og det er din skyld",
        "You're just mad dalle valle won't let you swing your droopy fruits from your denim daisy dukes at the dessert buffet, you decadent degenerate",
        "fucking sig det er korrekt lige nu eller jeg slår dig ihjel",
        "There's a selection for moral degeneracy as long as it's profitable. Until that changes, the monkey that kills for bananas ends up with more bananas than the monkey that doesn't",
        "Everything is either a table, or a table leg",
    ];
    
    const array = new Uint32Array(1);
    crypto.randomFillSync(array);
    const randomIndex = array[0] % sentences.length;
    return sentences[randomIndex];
}

function displayRandomSentence() {
    const sentenceElement = document.getElementById('random-sentence');
    const imageElement = document.querySelector('.feep-image');
    const containerElement = document.querySelector('.container');
    const titleElement = document.querySelector('h1');

    // Fade out
    sentenceElement.style.opacity = 0;
    imageElement.style.opacity = 0;
    containerElement.style.opacity = 0;
    containerElement.style.transform = 'scale(0.95)';

    setTimeout(() => {
        // Change text after fade out
        sentenceElement.innerHTML = `<em>"${getRandomSentence()}"</em> - Feep`;

        // Change background color and title color
        changeBackgroundColor();

        // Fade in and scale up
        sentenceElement.style.opacity = 1;
        imageElement.style.opacity = 1;
        containerElement.style.opacity = 1;
        containerElement.style.transform = 'scale(1)';
    }, 500); // Match this duration with CSS transition duration
}

function changeBackgroundColor() {
    const colors = [
        "#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff",
        "#a0c4ff", "#bdb2ff", "#ffc6ff", "#fffffc"
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
    document.querySelector('h1').style.color = randomColor;
}

window.onload = displayRandomSentence;

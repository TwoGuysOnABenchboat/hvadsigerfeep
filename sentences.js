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
        "Vareulv, Vareulv, Vareulv er sej "
    ];
    const randomIndex = Math.floor(Math.random() * sentences.length);
    return sentences[randomIndex] + " - Feep";
}

function displayRandomSentence() {
    const sentenceElement = document.getElementById('random-sentence');
    sentenceElement.innerHTML = `<em>"${getRandomSentence()}"</em>`;
}

window.onload = displayRandomSentence;

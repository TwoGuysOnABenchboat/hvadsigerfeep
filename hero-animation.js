const totalFrames = 25;
const frameDelayMs = 100;

const imageElement = document.getElementById("animated-image");
let frameIndex = 1;

const updateFrame = () => {
    frameIndex = (frameIndex % totalFrames) + 1;
    imageElement.src = `Graphics/Animation/frame${frameIndex}.png`;
};

setInterval(updateFrame, frameDelayMs);

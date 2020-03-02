const TIME_STEP_MAX = 0.1;

const wrapper = document.getElementById("wrapper");
const canvas = document.getElementById("renderer");
const renderer = new Renderer(canvas);
const parameters = new BountyParameters();
let bounty = new Bounty(parameters, renderer);
let lastDate = new Date();

/**
 * Resize the canvas
 */
const resize = () => {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;

    renderer.resize(canvas.width, canvas.height);
};

/**
 * To be called on each frame refresh
 * @param {Number} timeStep Passed time in seconds
 */
const update = timeStep => {
    bounty.update(timeStep);
    renderer.draw();
};

/**
 * A function called on each animation frame
 */
const loopFunction = () => {
    const date = new Date();

    update(Math.min(TIME_STEP_MAX, (date - lastDate) * 0.001));
    requestAnimationFrame(loopFunction);

    lastDate = date;
};

window.onresize = resize;
window.onkeydown = event => {
    if (event.key !== " ")
        return;

    bounty.free();
    parameters.seed = Math.floor(Math.random() * 0xFFFFFFFF);
    bounty = new Bounty(parameters, renderer);
};

resize();
requestAnimationFrame(loopFunction);
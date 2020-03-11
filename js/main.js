const TIME_STEP_MAX = 0.1;

const wrapper = document.getElementById("wrapper");
const canvas = document.getElementById("renderer");
const renderer = new Renderer(canvas);
const parameters = new IslandParameters();
const archipelago = new Archipelago(renderer);
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
    archipelago.update(timeStep);
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
window.onkeydown = event => archipelago.pressKey(event.key);
window.onmousemove = event => archipelago.mouseMove(event.clientX, event.clientY);
window.onwheel = event => archipelago.mouseScroll(Math.sign(event.deltaY));
window.onmousedown = event => {
    if (event.button === 0)
        archipelago.mousePress(event.clientX, event.clientY);
};
window.onmouseup = () => {
        archipelago.mouseRelease();
};

resize();
requestAnimationFrame(loopFunction);
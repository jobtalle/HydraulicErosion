const TIME_STEP_MAX = 0.1;

const wrapper = document.getElementById("wrapper");
const canvas = document.getElementById("renderer");
const renderer = new Renderer(canvas);
let bounty = new Bounty();
let lastDate = new Date();

const resize = () => {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;

    renderer.resize(canvas.width, canvas.height);
};

const update = timeStep => {
    renderer.draw();
};

const loopFunction = () => {
    const date = new Date();

    update(Math.min(TIME_STEP_MAX, (date - lastDate) * 0.001));
    requestAnimationFrame(loopFunction);

    lastDate = date;
};

window.onresize = resize;
window.onkeydown = () => {
    bounty.free();
    bounty = new Bounty();
};

resize();
requestAnimationFrame(loopFunction);
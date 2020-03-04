/**
 * The archipelago scene
 * @param {Renderer} renderer The renderer
 * @constructor
 */
const Archipelago = function(renderer) {
    this.island = null;
    this.camera = new CameraOrbit(renderer);

    this.generateIsland();
};

/**
 * Press a key
 * @param {String} key The pressed key
 */
Archipelago.prototype.pressKey = function(key) {
    if (key === " ")
        this.generateIsland();
};

/**
 * Press the mouse
 * @param {Number} x The mouse X coordinate
 * @param {Number} y The mouse Y coordinate
 */
Archipelago.prototype.mousePress = function(x, y) {
    this.camera.mousePress(x, y);
};

/**
 * Move the mouse
 * @param {Number} x The mouse X coordinate
 * @param {Number} y The mouse Y coordinate
 */
Archipelago.prototype.mouseMove = function(x, y) {
    this.camera.mouseMove(x, y);
};

/**
 * Release the mouse
 */
Archipelago.prototype.mouseRelease = function() {
    this.camera.mouseRelease();
};

/**
 * Scroll the mouse
 * @param {Number} sign The sign of the scroll direction
 */
Archipelago.prototype.mouseScroll = function(sign) {
    this.camera.mouseScroll(sign);
};

/**
 * Update the scene
 * @param {Number} timeStep The amount of seconds passed since the last frame
 */
Archipelago.prototype.update = function(timeStep) {
    if (this.island)
        this.island.update(timeStep);

    this.camera.update(timeStep);
};

/**
 * Generate a new island
 */
Archipelago.prototype.generateIsland = function() {
    if (this.island)
        this.island.free();
    parameters.seed = Math.floor(Math.random() * 0xFFFFFFFF);
    this.island = new Island(parameters, renderer);
    this.camera.setIsland(this.island);
};
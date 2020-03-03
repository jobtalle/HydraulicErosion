const CameraOrbit = function(renderer) {
    this.renderer = renderer;
    this.eye = new Vector();
    this.center = new Vector();
    this.angle = 0;
    this.pitch = Math.PI * .125;
    this.radius = this.RADIUS_DEFAULT;
    this.mouseDown = false;
    this.mouseX = 0;
    this.mouseY = 0;
};

CameraOrbit.prototype.ANGLE_SENSITIVITY = .008;
CameraOrbit.prototype.PITCH_SENSITIVITY = .008;
CameraOrbit.prototype.PITCH_MIN = 0;
CameraOrbit.prototype.PITCH_MAX = Math.PI * .499999;
CameraOrbit.prototype.RADIUS_DEFAULT = 20;
CameraOrbit.prototype.RADIUS_MIN = .1;
CameraOrbit.prototype.RADIUS_MAX = 60;
CameraOrbit.prototype.RADIUS_SPEED = .12;

/**
 * Set the island to focus on
 * @param {Island} island An island
 */
CameraOrbit.prototype.setIsland = function(island) {
    this.center.x = island.parameters.terrainParameters.width * .5;
    this.center.y = 0;
    this.center.z = island.parameters.terrainParameters.height * .5;
};

/**
 * Update the camera
 * @param {Number} timeStep The number of seconds passed since the last update
 */
CameraOrbit.prototype.update = function(timeStep) {
    this.eye.x = this.center.x + Math.cos(this.angle) * this.radius * Math.cos(this.pitch);
    this.eye.y = this.center.y + Math.sin(this.pitch) * this.radius;
    this.eye.z = this.center.z + Math.sin(this.angle) * this.radius * Math.cos(this.pitch);

    this.renderer.view(this.eye, this.center);
};

/**
 * Press the mouse
 * @param {Number} x The mouse X coordinate
 * @param {Number} y The mouse Y coordinate
 */
CameraOrbit.prototype.mousePress = function(x, y) {
    this.mouseDown = true;
    this.mouseX = x;
    this.mouseY = y;
};

/**
 * Move the mouse
 * @param {Number} x The mouse X coordinate
 * @param {Number} y The mouse Y coordinate
 */
CameraOrbit.prototype.mouseMove = function(x, y) {
    if (this.mouseDown) {
        this.angle += (this.mouseX - x) * this.ANGLE_SENSITIVITY;
        this.pitch += (y - this.mouseY) * this.PITCH_SENSITIVITY;
        this.mouseX = x;
        this.mouseY = y;

        if (this.angle < 0)
            this.angle += Math.PI * 2;
        else if (this.angle > Math.PI * 2)
            this.angle -= Math.PI * 2;

        if (this.pitch < this.PITCH_MIN)
            this.pitch = this.PITCH_MIN;
        else if (this.pitch > this.PITCH_MAX)
            this.pitch = this.PITCH_MAX;
    }
};

/**
 * Release the mouse
 */
CameraOrbit.prototype.mouseRelease = function() {
    this.mouseDown = false;
};

/**
 * Scroll the mouse
 * @param {Number} sign The sign of the scroll direction
 */
CameraOrbit.prototype.mouseScroll = function(sign) {
    this.radius *= 1 + sign * this.RADIUS_SPEED;

    if (this.radius < this.RADIUS_MIN)
        this.radius = this.RADIUS_MIN;
    else if (this.radius > this.RADIUS_MAX)
        this.radius = this.RADIUS_MAX;
};
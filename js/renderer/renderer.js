/**
 * The renderer
 * @param {HTMLCanvasElement} canvas A WebGL 1 capable canvas element
 * @constructor
 */
const Renderer = function(canvas) {
    this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    this.systemGeometry = new SystemGeometry(this.gl);
    this.systemTerrain = new SystemTerrain(this.gl);
    this.systemOcean = new SystemOcean(this.gl);
    this.matrixBuffer = new Array(16);
    this.matrixProjection = new Matrix();
    this.matrixModelView = new Matrix();
    this.matrixMVP = new Matrix();

    this.resize(canvas.width, canvas.height);
    this.setup();
};

Renderer.prototype.ZNEAR = .1;
Renderer.prototype.ZFAR = 100;
Renderer.prototype.ANGLE = Math.PI * .35;

/**
 * Calculate the current MVP matrix
 */
Renderer.prototype.updateMatrices = function() {
    this.matrixMVP.set(this.matrixProjection);
    this.matrixMVP.multiply(this.matrixModelView);
    this.matrixMVP.toArray(this.matrixBuffer);
};

/**
 * Draw the scene in this renderer
 */
Renderer.prototype.draw = function() {
    this.gl.viewport(0, 0, this.width, this.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.systemTerrain.draw(this.matrixBuffer);
    this.systemOcean.draw(this.matrixBuffer);
    this.systemGeometry.draw(this.matrixBuffer);
};

/**
 * Setup the renderer
 */
Renderer.prototype.setup = function() {
    this.gl.getExtension("OES_element_index_uint");
    this.gl.clearColor(.3, .3, .35, 1);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
};

/**
 * Resize the renderer
 * @param {Number} width The canvas width in pixels
 * @param {Number} height The canvas height in pixels
 */
Renderer.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;
    this.matrixProjection.perspective(this.ANGLE, width / height, this.ZNEAR, this.ZFAR);
};

/**
 * Set the current camera parameters
 * @param {Vector} from A vector from which the camera projects
 * @param {Vector} to A vector to aim the camera towards
 */
Renderer.prototype.view = function(from, to) {
    this.matrixModelView.lookAt(from, to, Vector.UP);
    this.updateMatrices();
};
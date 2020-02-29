/**
 * A height map rendered by the terrain renderer
 * @param {Array} container The array in which to store the reference to this height map
 * @param {WebGLRenderingContext} gl The WebGL 1 rendering context
 * @param {Number} width The terrain width
 * @param {Number} height The terrain height
 * @param {Array} values The array containing all height values
 * @constructor
 */
SystemTerrain.HeightMap = function(container, gl, width, height, values) {
    this.container = container;
    this.gl = gl;

    this.container.push(this);
};

/**
 * Draw this height map
 */
SystemTerrain.HeightMap.prototype.draw = function() {

};

/**
 * Free this height map
 */
SystemTerrain.HeightMap.prototype.free = function() {
    this.container.splice(this.container.indexOf(this), 1);
};
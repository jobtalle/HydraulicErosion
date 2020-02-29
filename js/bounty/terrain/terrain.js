/**
 * A terrain
 * @param {TerrainParameters} parameters The terrain parameters
 * @constructor
 */
const Terrain = function(parameters) {
    this.heightMap = new HeightMap(
        parameters.heightMapParameters,
        Math.ceil(parameters.width / this.RESOLUTION) + 1,
        Math.ceil(parameters.height / this.RESOLUTION) + 1);

    console.log("Created terrain");
};

Terrain.prototype.RESOLUTION = .1;

/**
 * Create a terrain model and add it to the rendered scene
 * @param {Renderer} renderer The renderer
 */
Terrain.prototype.createModel = function(renderer) {

};

/**
 * Free all resources occupied by the terrain
 */
Terrain.prototype.free = function() {
    console.log("Freed terrain");
};
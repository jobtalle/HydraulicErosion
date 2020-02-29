/**
 * A terrain
 * @param {TerrainParameters} parameters The terrain parameters
 * @constructor
 */
const Terrain = function(parameters) {
    this.parameters = parameters;
    this.model = null;
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
    this.model = renderer.systemTerrain.makeHeightMap(
        this.heightMap.xValues,
        this.heightMap.yValues,
        this.heightMap.values,
        this.RESOLUTION);
};

/**
 * Free all resources occupied by the terrain
 */
Terrain.prototype.free = function() {
    if (this.model)
        this.model.free();

    console.log("Freed terrain");
};
/**
 * A terrain
 * @param {TerrainParameters} parameters The terrain parameters
 * @param {Random} random A randomizer
 * @constructor
 */
const Terrain = function(parameters, random) {
    this.random = random;
    this.parameters = parameters;
    this.model = null;
    this.heightMap = null;

    console.log("Created terrain");
};

Terrain.prototype.RESOLUTION = .15;

/**
 * Create a height map for this terrain
 */
Terrain.prototype.createHeightMap = function() {
    this.heightMap = new HeightMap(
        this.parameters.heightMapParameters,
        Math.ceil(this.parameters.width / this.RESOLUTION) + 1,
        Math.ceil(this.parameters.height / this.RESOLUTION) + 1,
        this.RESOLUTION,
        this.random);
};

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
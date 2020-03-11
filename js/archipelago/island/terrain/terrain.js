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
    this.ocean = null;
};

/**
 * Created a height mask shape based on the terrain parameters
 * @returns {Object} One of the valid height mask shapes
 */
Terrain.prototype.createShape = function() {
    switch (this.parameters.shape) {
        default:
        case TerrainParameters.SHAPE_CONE:
            return new ShapeCone(this.parameters.width, this.parameters.height, this.parameters.shapePower);
    }
};

/**
 * Create volcanoes on this terrain
 */
Terrain.prototype.createVolcanoes = function() {
    new Volcanoes(this.parameters.volcanoesParameters, this.random).apply(this.heightMap);
};

/**
 * Apply hydraulic erosion to the terrain
 */
Terrain.prototype.erodeHydraulic = function() {
    new ErosionHydraulic(
        this.parameters.erosionHydraulicParameters,
        this.parameters.resolution,
        this.random).apply(this.heightMap);
};

/**
 * Apply coastal erosion to terrain
 */
Terrain.prototype.erodeCoastal = function() {
    new ErosionCoastal(
        this.parameters.erosionCoastalParameters,
        this.parameters.resolution,
        this.random).apply(this.heightMap);
};

/**
 * Create a height map for this terrain
 */
Terrain.prototype.createHeightMap = function() {
    this.heightMap = new HeightMap(
        this.parameters.heightMapParameters,
        Math.ceil(this.parameters.width / this.parameters.resolution) + 1,
        Math.ceil(this.parameters.height / this.parameters.resolution) + 1,
        this.parameters.resolution,
        this.createShape(),
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
        this.parameters.resolution);
};

/**
 * Create an ocean model and add it to the rendered scene
 * @param {Renderer} renderer The renderer
 */
Terrain.prototype.createOcean = function(renderer) {
    this.ocean = renderer.systemOcean.makeHeightMap(
        this.heightMap.xValues,
        this.heightMap.yValues,
        this.heightMap.values,
        this.parameters.resolution,
        this.model,
        this.heightMap,
        this.parameters.water);
};

/**
 * Free all resources occupied by the terrain
 */
Terrain.prototype.free = function() {
    if (this.model) {
        this.model.free();
        this.model = null;
    }

    if (this.ocean) {
        this.ocean.free();
        this.ocean = null;
    }
};
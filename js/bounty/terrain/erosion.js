/**
 * Erosion simulation
 * @param {ErosionParameters} parameters The parameters
 * @param {Number} resolution The terrain resolution
 * @param {Random} random A randomizer
 * @constructor
 */
const Erosion = function(parameters, resolution, random) {
    this.parameters = parameters;
    this.resolution = resolution;
    this.random = random;
};

Erosion.prototype.trace = function(x, y, heightMap) {
    heightMap.change(x, y, .03);
};

/**
 * Apply erosion
 * @param {HeightMap} heightMap The height map to erode
 */
Erosion.prototype.apply = function(heightMap) {
    for (let i = 0; i < 100000; ++i)
        this.trace(
            this.random.getFloat() * heightMap.xValues * this.resolution,
            this.random.getFloat() * heightMap.yValues * this.resolution,
            heightMap);
};
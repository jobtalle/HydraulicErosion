/**
 * @param {ErosionCoastalParameters} parameters The parameters
 * @param {Number} resolution The terrain resolution
 * @param {Random} random A randomizer
 * @constructor
 */
const ErosionCoastal = function(parameters, resolution, random) {
    this.parameters = parameters;
    this.resolution = resolution;
    this.random = random;
};

/**
 * Apply erosion
 * @param {HeightMap} heightMap The height map to erode
 */
ErosionCoastal.prototype.apply = function(heightMap) {
    const noise = new CubicNoise(
        Math.ceil(heightMap.xValues * this.resolution * this.parameters.noiseScale),
        Math.ceil(heightMap.yValues * this.resolution * this.parameters.noiseScale),
        this.random);

    for (let y = 0; y < heightMap.yValues; ++y) for (let x = 0; x < heightMap.xValues; ++x) {
        const index = x + y * heightMap.xValues;
        const power = this.parameters.power;
        const threshold = this.parameters.waveHeightMin + noise.sample(
            x * this.resolution * this.parameters.noiseScale,
            y * this.resolution * this.parameters.noiseScale) *
            (this.parameters.waveHeightMax - this.parameters.waveHeightMin);

        if (heightMap.values[index] < threshold)
            heightMap.values[index] *= (heightMap.values[index] / threshold) ** power;
    }
};
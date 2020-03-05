/**
 * Volcano modeller
 * @param {VolcanoesParameters} parameters Parameters
 * @param {Random} random A randomizer
 * @constructor
 */
const Volcanoes = function(parameters, random) {
    this.parameters = parameters;
    this.random = random;
};

/**
 * Created volcanoes on a height map
 * @param {HeightMap} heightMap A height map to generate volcanoes on
 */
Volcanoes.prototype.apply = function(heightMap) {
    const rimNoise = new CubicNoise(
        Math.ceil(heightMap.xValues * heightMap.resolution * this.parameters.volcanoThresholdScale),
        Math.ceil(heightMap.yValues * heightMap.resolution * this.parameters.volcanoThresholdScale),
        this.random);
    const volcanoThreshold = Math.max(
        this.parameters.volcanoThreshold,
        heightMap.maxHeight - this.parameters.volcanoMaxDepth * (1 / this.parameters.volcanoCraterScale));

    for (let y = 0; y < heightMap.yValues; ++y) for (let x = 0; x < heightMap.xValues; ++x) {
        const height = heightMap.values[x + y * heightMap.xValues];
        const threshold = (2 * rimNoise.sample(
            x * heightMap.resolution * this.parameters.volcanoThresholdScale,
            y * heightMap.resolution * this.parameters.volcanoThresholdScale) - .5) *
            this.parameters.volcanoThresholdAmplitude + volcanoThreshold;

        if (height > threshold)
            heightMap.values[x + y * heightMap.xValues] -= (height - threshold) * (1 + this.parameters.volcanoCraterScale);
    }
};
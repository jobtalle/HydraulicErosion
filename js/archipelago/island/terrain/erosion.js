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

/**
 * Let a droplet erode the height map
 * @param {Number} x The X coordinate to start at
 * @param {Number} y The Y coordinate to start at
 * @param {HeightMap} heightMap The height map to erode
 */
Erosion.prototype.trace = function(x, y, heightMap) {
    const ox = (-1 + this.random.getFloat() * 2) * this.parameters.radius * this.resolution;
    const oy = (-1 + this.random.getFloat() * 2) * this.parameters.radius * this.resolution;
    let flats = 0;
    let sediment = 0;
    let xp = x;
    let yp = y;

    for (let i = 0; i < this.parameters.maxIterations; ++i) {
        const surfaceNormal = heightMap.sampleNormal(x, y);
        const flatness = Vector.UP.dot(surfaceNormal);

        if (flatness === 1)
            break;

        flats = 0;

        const slopeMagnitude = Math.sqrt(surfaceNormal.x * surfaceNormal.x + surfaceNormal.z * surfaceNormal.z);
        const slopeSpeed = this.parameters.speed * this.resolution / slopeMagnitude;
        const erosion = this.parameters.erosionRate * (1 - flatness);
        const deposit = sediment * this.parameters.depositionRate * flatness;

        heightMap.change(xp + ox, yp + oy, deposit - erosion);

        xp = x;
        yp = y;
        x += surfaceNormal.x * slopeSpeed;
        y += surfaceNormal.z * slopeSpeed;
        sediment += erosion - deposit;
    }

    heightMap.change(xp + ox, yp + oy, sediment);
};

/**
 * Apply erosion
 * @param {HeightMap} heightMap The height map to erode
 */
Erosion.prototype.apply = function(heightMap) {
    const drops = this.parameters.dropsPerCell * (heightMap.xValues - 1) * (heightMap.yValues - 1);

    for (let i = 0; i < drops; ++i)
        this.trace(
            this.random.getFloat() * heightMap.xValues * this.resolution,
            this.random.getFloat() * heightMap.yValues * this.resolution,
            heightMap);

    heightMap.blur(this.parameters.postBlur);
};
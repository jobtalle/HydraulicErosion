/**
 * Hydraulic erosion simulation
 * @param {ErosionHydraulicParameters} parameters The parameters
 * @param {Number} resolution The terrain resolution
 * @param {Random} random A randomizer
 * @constructor
 */
const ErosionHydraulic = function(parameters, resolution, random) {
    this.parameters = parameters;
    this.resolution = resolution;
    this.random = random;
};

/**
 * Let a droplet erode the height map
 * @param {Number} x The X coordinate to start at
 * @param {Number} y The Y coordinate to start at
 * @param {HeightMap} heightMap The height map to erodeHydraulic
 */
ErosionHydraulic.prototype.trace = function(x, y, heightMap) {
    const ox = (this.random.getFloat() * 2 - 1) * this.parameters.radius * this.resolution;
    const oy = (this.random.getFloat() * 2 - 1) * this.parameters.radius * this.resolution;
    let sediment = 0;
    let xp = x;
    let yp = y;
    let vx = 0;
    let vy = 0;

    for (let i = 0; i < this.parameters.maxIterations; ++i) {
        const surfaceNormal = heightMap.sampleNormal(x + ox, y + oy);

        if (surfaceNormal.y === 1)
            break;

        const deposit = sediment * this.parameters.depositionRate * surfaceNormal.y;
        const erosion = this.parameters.erosionRate * (1 - surfaceNormal.y) *
            Math.min(1, i * this.parameters.iterationScale);

        heightMap.change(xp, yp,deposit - erosion);

        vx = this.parameters.friction * vx + surfaceNormal.x * this.parameters.speed * this.resolution;
        vy = this.parameters.friction * vy + surfaceNormal.z * this.parameters.speed * this.resolution;

        xp = x;
        yp = y;
        x += vx;
        y += vy;
        sediment += erosion - deposit;
    }
};

/**
 * Apply erosion
 * @param {HeightMap} heightMap The height map to erode
 */
ErosionHydraulic.prototype.apply = function(heightMap) {
    const drops = this.parameters.dropsPerCell * (heightMap.xValues - 1) * (heightMap.yValues - 1);

    for (let i = 0; i < drops; ++i)
        this.trace(
            this.random.getFloat() * heightMap.xValues * this.resolution,
            this.random.getFloat() * heightMap.yValues * this.resolution,
            heightMap);

    heightMap.blur(this.parameters.postBlur);
};
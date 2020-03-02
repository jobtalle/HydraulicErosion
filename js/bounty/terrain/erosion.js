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
    const erosionBase = .004;
    const erosionPerSlope = .007;
    const depositBase = .1;
    const depositPerSlope = .003;
    let sediment = 0;
    let vx = 0;
    let vy = 0;

    for (let i = 0; i < 300; ++i) {
        const surfaceNormal = heightMap.sampleNormal(x, y);
        const slope = Math.sqrt(surfaceNormal.x * surfaceNormal.x + surfaceNormal.z * surfaceNormal.z);
        const erosion = (erosionBase + slope * erosionPerSlope);
        const deposit = sediment * Math.min(1, depositBase + depositPerSlope * .1);

        sediment += erosion - deposit;

        heightMap.change(x, y, deposit);

        if (slope !== 0) {
            const m = .2 * this.resolution / slope;

            vx += surfaceNormal.x * m;
            vy += surfaceNormal.z * m;
        }

        x += vx;
        y += vy;

        if (x < 0 || y < 0 || x > heightMap.xValues * this.resolution || y > heightMap.yValues * this.resolution)
            break;

        heightMap.change(x, y, -erosion);

        if (i > 5 && Math.sqrt(vx * vx + vy * vy) < this.resolution)
            break;
    }
};

/**
 * Apply erosion
 * @param {HeightMap} heightMap The height map to erode
 */
Erosion.prototype.apply = function(heightMap) {
    // TODO: Only spawn droplets within mask, possibly altitude limit
    for (let i = 0; i < 50000; ++i)
        this.trace(
            this.random.getFloat() * heightMap.xValues * this.resolution,
            this.random.getFloat() * heightMap.yValues * this.resolution,
            heightMap);
};
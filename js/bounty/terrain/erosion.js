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
    const offsetRadius = 1.5;
    const friction = .8;
    const erosionPerSpeed = .2;
    const depositRate = .1;
    let sediment = 0;
    let vx = 0;
    let vy = 0;

    const or = this.resolution * offsetRadius;
    const ox = (-1 + 2 * this.random.getFloat()) * or;
    const oy = (-1 + 2 * this.random.getFloat()) * or;

    for (let i = 0; i < 300; ++i) {
        const speed = Math.sqrt(vx * vx + vy * vy);
        const surfaceNormal = heightMap.sampleNormal(x, y);
        const slope = Math.sqrt(surfaceNormal.x * surfaceNormal.x + surfaceNormal.z * surfaceNormal.z);
        const slopeness = 1 - Vector.UP.dot(surfaceNormal);
        const erosion = Math.min(speed * erosionPerSpeed, heightMap.sampleHeight(x, y)) * slopeness;
        const deposit = sediment * depositRate * slopeness;

        if (slopeness < .02)
            break;

        sediment += erosion - deposit;

        heightMap.change(x + ox, y + oy, deposit - erosion);

        vx *= friction;
        vy *= friction;

        if (slope !== 0) {
            const m = .08 * this.resolution / slope;

            vx += surfaceNormal.x * m;
            vy += surfaceNormal.z * m;
        }

        x += vx + (-1 + 2 * this.random.getFloat()) * this.resolution * 0.1;
        y += vy + (-1 + 2 * this.random.getFloat()) * this.resolution * 0.1;

        if (x < 0 || y < 0 || x > heightMap.xValues * this.resolution || y > heightMap.yValues * this.resolution)
            break;
    }
};

/**
 * Apply erosion
 * @param {HeightMap} heightMap The height map to erode
 */
Erosion.prototype.apply = function(heightMap) {
    // TODO: Only spawn droplets within mask, possibly altitude limit
    for (let i = 0; i < 20000; ++i)
        this.trace(
            this.random.getFloat() * heightMap.xValues * this.resolution,
            this.random.getFloat() * heightMap.yValues * this.resolution,
            heightMap);
};
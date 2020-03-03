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

Erosion.prototype.TRACE_THRESHOLD = .01;
Erosion.prototype.MAX_ITERATIONS = 250;

/**
 * Let a droplet erode the height map
 * @param {Number} x The X coordinate to start at
 * @param {Number} y The Y coordinate to start at
 * @param {HeightMap} heightMap The height map to erode
 */
Erosion.prototype.trace = function(x, y, heightMap) {
    const ox = (-1 + 2 * this.random.getFloat()) * this.resolution * this.parameters.radius;
    const oy = (-1 + 2 * this.random.getFloat()) * this.resolution * this.parameters.radius;
    let first = true;
    let sediment = 0;
    let vx = 0;
    let vy = 0;

    for (let i = 0; i < this.MAX_ITERATIONS; ++i) {
        const surfaceNormal = heightMap.sampleNormal(x, y);
        let steepness = (1 - Vector.UP.dot(surfaceNormal));

        if ((!first && steepness < this.TRACE_THRESHOLD) || steepness < this.parameters.steepnessThreshold)
            return;

        first = false;
        steepness = steepness * this.parameters.steepnessInfluence + (1 - this.parameters.steepnessInfluence);

        const speed = Math.sqrt(vx * vx + vy * vy);
        const slope = Math.sqrt(surfaceNormal.x * surfaceNormal.x + surfaceNormal.z * surfaceNormal.z);
        const erosion = Math.min(speed * this.parameters.erosionRate, heightMap.sampleHeight(x, y)) * steepness;
        const deposit = sediment * this.parameters.depositionRate;

        sediment += erosion - deposit;

        heightMap.change(x + ox, y + oy, deposit - erosion);

        vx *= this.parameters.friction;
        vy *= this.parameters.friction;

        if (slope !== 0) {
            const m = .08 * this.resolution / slope;

            vx += surfaceNormal.x * m;
            vy += surfaceNormal.z * m;
        }

        x += vx;
        y += vy;
    }
};

/**
 * Apply erosion
 * @param {HeightMap} heightMap The height map to erode
 */
Erosion.prototype.apply = function(heightMap) {
    const drops = this.parameters.dropsPerCell * (heightMap.xValues - 1) * (heightMap.yValues - 1);

    for (let i = 0; i < drops; ++i) {
        this.trace(
            this.random.getFloat() * heightMap.xValues * this.resolution,
            this.random.getFloat() * heightMap.yValues * this.resolution,
            heightMap);
    }

    heightMap.blur(this.parameters.postBlur);
};
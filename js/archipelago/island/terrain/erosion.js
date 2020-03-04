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

Erosion.prototype.MAX_ITERATIONS = 500;

/**
 * Let a droplet erode the height map
 * @param {Number} x The X coordinate to start at
 * @param {Number} y The Y coordinate to start at
 * @param {HeightMap} heightMap The height map to erode
 */
Erosion.prototype.trace = function(x, y, heightMap) {
    const ox = (-1 + this.random.getFloat() * 2) * this.parameters.radius * this.resolution;
    const oy = (-1 + this.random.getFloat() * 2) * this.parameters.radius * this.resolution;
    let sediment = 0;
    let vx = 0;
    let vy = 0;
    let xp = x;
    let yp = y;

    for (let i = 0; i < this.MAX_ITERATIONS; ++i) {
        const surfaceNormal = heightMap.sampleNormal(x, y);
        const speed = Math.sqrt(vx * vx + vy * vy);
        let steepness = 1 - Vector.UP.dot(surfaceNormal);

        if (sediment < this.parameters.sedimentEvaporateThreshold && steepness < this.parameters.steepnessThreshold)
            break;

        steepness = this.parameters.steepnessInfluence * steepness + (1 - this.parameters.steepnessInfluence);

        const slope = Math.sqrt(surfaceNormal.x * surfaceNormal.x + surfaceNormal.z * surfaceNormal.z);
        const sedimentRoom = this.parameters.sedimentMax - sediment;

        if (sedimentRoom < 0) {
            sediment += sedimentRoom;

            heightMap.change(xp + ox, yp + oy, sedimentRoom);
        }
        else {
            const erosion = Math.min(
                this.parameters.sedimentUptakeMax,
                Math.min(sedimentRoom, speed * this.parameters.erosionRate * steepness));
            const deposit = sediment * this.parameters.depositionRate * (1 - steepness);

            sediment += erosion - deposit;

            heightMap.change(xp + ox, yp + oy, deposit - erosion);
        }

        vx *= this.parameters.friction;
        vy *= this.parameters.friction;

        if (slope !== 0) {
            const m = this.parameters.acceleration * this.resolution / slope;

            vx = surfaceNormal.x * m;
            vy = surfaceNormal.z * m;
        }

        xp = x;
        yp = y;
        x += vx;
        y += vy;
    }

    heightMap.change(x, y, sediment);
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
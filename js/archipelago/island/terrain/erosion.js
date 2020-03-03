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

Erosion.prototype.MAX_ITERATIONS = 200;

/**
 * Let a droplet erode the height map
 * @param {Number} x The X coordinate to start at
 * @param {Number} y The Y coordinate to start at
 * @param {HeightMap} heightMap The height map to erode
 */
Erosion.prototype.trace = function(x, y, heightMap) {
    const ox = (-1 + 2 * this.random.getFloat()) * this.resolution * this.parameters.radius;
    const oy = (-1 + 2 * this.random.getFloat()) * this.resolution * this.parameters.radius;
    let sediment = 0;
    let vx = 0;
    let vy = 0;

    for (let i = 0; i < this.MAX_ITERATIONS; ++i) {
        const surfaceNormal = heightMap.sampleNormal(x, y);
        let steepness = (1 - Vector.UP.dot(surfaceNormal));

        if (steepness < this.parameters.steepnessThreshold)
            break;

        steepness = steepness * this.parameters.steepnessInfluence + (1 - this.parameters.steepnessInfluence);

        const speed = Math.sqrt(vx * vx + vy * vy);
        const slope = Math.sqrt(surfaceNormal.x * surfaceNormal.x + surfaceNormal.z * surfaceNormal.z);
        const erosion = speed * this.parameters.erosionRate * steepness;
        const deposit = sediment * this.parameters.depositionRate;

        sediment += erosion - deposit;

        heightMap.change(x + ox, y + oy, deposit - erosion);

        vx *= this.parameters.friction;
        vy *= this.parameters.friction;

        const m = this.parameters.acceleration * this.resolution / slope;

        vx += surfaceNormal.x * m;
        vy += surfaceNormal.z * m;

        x += vx;
        y += vy;
    }
};

/**
 * Apply erosion
 * @param {HeightMap} heightMap The height map to erode
 */
Erosion.prototype.apply = function(heightMap) {
    const height = heightMap.values;
    const water = new Array(heightMap.values.length).fill(0);
    const sediment = new Array(heightMap.values.length).fill(0);
    const tempSediment = new Array(height.values().length).fill(0);
    const fluxLeft = new Array(heightMap.values.length).fill(0);
    const fluxTop = new Array(heightMap.values.length).fill(0);
    const fluxRight = new Array(heightMap.values.length).fill(0);
    const fluxBottom = new Array(heightMap.values.length).fill(0);
    const vx = new Array(heightMap.values.length).fill(0);
    const vy = new Array(heightMap.values.length).fill(0);

    const cycles = 200;
    const waterFrequency = 50;
    let waterCountdown = 1;

    for (let cycle = 0; cycle < cycles; ++cycle) {
        if (--waterCountdown === 0) {
            waterCountdown = waterFrequency;

            for (let i = 0; i < water.length; ++i)
                water[i] += .1;
        }

        const fluxFactor = .15;

        const flowSpeed = .3;

        const sedimentCapacity = 55;
        const dissolve = .3;
        const deposit = .3;
        const maxUptake = .09;

        const evaporationRate = .04;

        // Simulate flow
        for (let y = 1; y < heightMap.yValues - 1; ++y) for (let x = 1; x < heightMap.xValues - 1; ++x) {
            const index = x + y * heightMap.xValues;
            const left = index - 1;
            const right = index + 1;
            const top = index - heightMap.xValues;
            const bottom = index + heightMap.xValues;

            const pressure = height[index] + water[index];

            const deltaLeft = pressure - height[left] + water[left];
            const deltaTop = pressure - height[top] + water[top];
            const deltaRight = pressure - height[right] + water[right];
            const deltaBottom = pressure - height[bottom] + water[bottom];

            fluxLeft[index] = Math.max(0, fluxLeft[index] + fluxFactor * deltaLeft);
            fluxTop[index] = Math.max(0, fluxTop[index] + fluxFactor * deltaTop);
            fluxRight[index] = Math.max(0, fluxRight[index] + fluxFactor * deltaRight);
            fluxBottom[index] = Math.max(0, fluxBottom[index] + fluxFactor * deltaBottom);

            const fluxTotal = fluxLeft[index] + fluxTop[index] + fluxRight[index] + fluxBottom[index];

            if (fluxTotal > water[index]) {
                const scale = water[index] / fluxTotal;

                fluxLeft[index] *= scale;
                fluxTop[index] *= scale;
                fluxRight[index] *= scale;
                fluxBottom[index] *= scale;
            }
        }

        // Update flow velocity
        for (let y = 1; y < heightMap.yValues - 1; ++y) for (let x = 1; x < heightMap.xValues - 1; ++x) {
            const index = x + y * heightMap.xValues;
            const left = index - 1;
            const right = index + 1;
            const top = index - heightMap.xValues;
            const bottom = index + heightMap.xValues;

            const flowIn = fluxRight[left] + fluxBottom[top] + fluxLeft[right] + fluxTop[bottom];
            const flowOut = fluxLeft[index] + fluxTop[index] + fluxRight[index] + fluxBottom[index];
            const flowDelta = flowIn - flowOut;
            const waterPrevious = water[index];

            water[index] = Math.max(0, water[index] + flowDelta * flowSpeed);

            const meanWater = .5 * (waterPrevious + water[index]);

            if (meanWater === 0)
                vx[index] = vy[index] = 0;
            else {
                vx[index] = .5 * (fluxRight[left] - fluxLeft[index] - fluxLeft[right] + fluxRight[index]) / meanWater;
                vy[index] = .5 * (fluxBottom[top] - fluxTop[index] - fluxTop[bottom] + fluxBottom[index]) / meanWater;
            }

            // TODO: Verify whether flow direction checks out
        }

        // Simulate erosion
        for (let y = 1; y < heightMap.yValues - 1; ++y) for (let x = 1; x < heightMap.xValues - 1; ++x) {
            const index = x + y * heightMap.xValues;

            const normal = heightMap.sampleNormal(x, y);
            const slope = Math.max(.1, normal.dot(Vector.UP));
            const flowVelocity = Math.sqrt(vx[index] * vx[index] + vy[index] * vy[index]);
            const flowCapacity = sedimentCapacity * flowVelocity * slope * Math.min(maxUptake, water[index]);
            const delta = flowCapacity - sediment[index];

            if (delta > 0) {
                // dissolve
                const amount = dissolve * delta;

                height[index] -= amount;
                sediment[index] += amount;
            } else if (delta < 0) {
                // deposit
                const amount = deposit * delta;

                height[index] += amount;
                sediment[index] -= amount;
            }
        }

        // Simulate sediment movement
        for (let y = 1; y < heightMap.yValues - 1; ++y) for (let x = 1; x < heightMap.xValues - 1; ++x) {
            const index = x + y * heightMap.xValues;

            const fromX = x - vx[index] * flowSpeed;
            const fromY = y - vy[index] * flowSpeed;
            const x0 = Math.min(heightMap.xValues, Math.max(0, Math.floor(x)));
            const y0 = Math.min(heightMap.yValues, Math.max(0, Math.floor(y)));
            const x1 = Math.min(heightMap.xValues, Math.max(0, x0 + 1));
            const y1 = Math.min(heightMap.yValues, Math.max(0, y0 + 1));
            const fx = fromX - x0;
            const fy = fromY - y0;
            const sedimentLeftTop = sediment[x0 + y0 * this.xValues];
            const sedimentLeftBottom = sediment[x0 + y1 * this.xValues];
            const sedimentRightTop = sediment[x1 + y0 * this.xValues];
            const sedimentRightBottom = sediment[x1 + y1 * this.xValues];

            const top = fx * sedimentLeftTop + (1 - fx) * (sedimentRightTop - sedimentLeftTop);
            const bottom = fx * sedimentLeftBottom + (1 - fx) * (sedimentRightBottom - sedimentLeftBottom);

            tempSediment[index] = fy * top + (1 - fy) * (bottom - top);
        }

        for (let i = 0; i < sediment.length; ++i)
            sediment[i] = tempSediment[i];

        // Simulate evaporation
        for (let y = 1; y < heightMap.yValues - 1; ++y) for (let x = 1; x < heightMap.xValues - 1; ++x) {
            const index = x + y * heightMap.xValues;

            water[index] = Math.max(0, water[index] * (1 - evaporationRate));
        }
    }
};
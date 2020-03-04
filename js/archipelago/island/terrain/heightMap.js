/**
 * A height map for terrain generation
 * @param {HeightMapParameters} parameters Height map parameters
 * @param {Number} xValues The amount of X values to generate
 * @param {Number} yValues The amount of Y values to generate
 * @param {Number} resolution The terrain resolution
 * @param {Object} shape A terrain shape
 * @param {Random} random A randomizer
 * @constructor
 */
const HeightMap = function(
    parameters,
    xValues,
    yValues,
    resolution,
    shape,
    random) {
    this.parameters = parameters;
    this.xValues = xValues;
    this.yValues = yValues;
    this.resolution = resolution;
    this.shape = shape;
    this.random = random;
    this.values = new Array(xValues * yValues);
    this.maxHeight = 0;

    this.generate();
};

/**
 * Create the cubic noises that add to the height values
 * @returns {Array} An array of CubicNoise objects
 */
HeightMap.prototype.createNoises = function() {
    const noises = new Array(this.parameters.octaves);
    let scale = this.parameters.scale;

    for (let octave = 0; octave < this.parameters.octaves; ++octave) {
        noises[octave] = new CubicNoise(
            Math.ceil(scale * this.xValues),
            Math.ceil(scale * this.yValues),
            this.random);

        scale *= this.parameters.scaleFalloff;
    }

    return noises;
};

/**
 * Make a number of octave influences summing up to 1
 * @param {Number} octaves The number of octaves
 * @param {Number} falloff The influence falloff per octave
 */
HeightMap.prototype.makeInfluences = function(octaves, falloff) {
    const influences = new Array(octaves);
    const iFalloff = 1 / falloff;
    let influence = ((iFalloff - 1) * (iFalloff ** octaves)) / (iFalloff ** octaves - 1) / iFalloff;

    for (let octave = 0; octave < octaves; ++octave) {
        influences[octave] = influence;

        if (octave !== octaves - 1)
            influence *= falloff;
    }

    return influences;
};

/**
 * Calculate all height values
 */
HeightMap.prototype.generate = function() {
    const noises = this.createNoises();
    const influences = this.makeInfluences(this.parameters.octaves, this.parameters.influenceFalloff);

    for (let y = 0; y < this.yValues; ++y) for (let x = 0; x < this.xValues; ++x) {
        const index = x + y * this.xValues;
        let scale = this.parameters.scale * this.resolution;
        let height = 0;

        for (let octave = 0; octave < this.parameters.octaves; ++octave) {
            height += noises[octave].sample(x * scale, y * scale) * influences[octave];

            if (octave !== this.parameters.octaves - 1)
                scale *= this.parameters.scaleFalloff;
        }

        this.values[index] =
            (height ** this.parameters.heightPower) *
            this.parameters.amplitude *
            this.shape.sample(x * this.resolution, y * this.resolution);

        if (this.maxHeight < this.values[index])
            this.maxHeight = this.values[index];
    }
};

/**
 * Add an amount to a single value index
 * @param {Number} xIndex The X index
 * @param {Number} yIndex The Y index
 * @param {Number} amount The amount of change
 */
HeightMap.prototype.changePoint = function(xIndex, yIndex, amount) {
    const index = xIndex + this.xValues * yIndex;

    this.values[index] += Math.max(-this.values[index], amount);
};

/**
 * Return the height value from a single point
 * @param {Number} xIndex The X index
 * @param {Number} yIndex The Y index
 * @return {Number} The height value at the given point
 */
HeightMap.prototype.getPoint = function(xIndex, yIndex) {
    return this.values[xIndex + yIndex * this.xValues];
};

/**
 * Apply gaussian blur to the height values
 * @param {Number} amount The amount of blur in the range [0, 1]
 */
HeightMap.prototype.blur = function(amount) {
    const newValues = new Array((this.xValues - 2) * (this.yValues - 2));

    for (let y = 1; y < this.yValues - 1; ++y) for (let x = 1; x < this.xValues - 1; ++x) {
        newValues[x - 1 + (y - 1) * (this.xValues - 2)] =
            (
                this.getPoint(x - 1, y) +
                this.getPoint(x, y - 1) +
                this.getPoint(x + 1, y) +
                this.getPoint(x, y + 1)
            ) * .125 +
            (
                this.getPoint(x - 1, y -1) +
                this.getPoint(x + 1, y - 1) +
                this.getPoint(x + 1, y + 1) +
                this.getPoint(x - 1, y + 1)
            ) * .0625 +
            this.values[x + y * this.xValues] * .25;
    }

    for (let y = 1; y < this.yValues - 1; ++y) for (let x = 1; x < this.xValues - 1; ++x)
            this.changePoint(x, y, amount * (newValues[x - 1 + (y - 1) * (this.xValues - 2)] - this.getPoint(x, y)));
};

/**
 * Sample terrain height
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @returns {Number} The height at this point
 */
HeightMap.prototype.sampleHeight = function(x, y) {
    if (x < 0 || y < 0)
        return 0;

    x /= this.resolution;
    y /= this.resolution;

    const xi = Math.floor(x);
    const yi = Math.floor(y);

    if (xi >= this.xValues - 1 || yi >= this.yValues - 1)
        return 0;

    const fx = x - xi;
    const fy = y - yi;
    const ylu = this.values[xi + yi * this.xValues];
    const yld = this.values[xi + (yi + 1) * this.xValues];
    const yru = this.values[xi + 1 + yi * this.xValues];
    const yrd = this.values[xi + 1 + (yi + 1) * this.xValues];
    const yl = ylu + (yld - ylu) * fy;
    const yr = yru + (yrd - yru) * fy;

    return yl + (yr - yl) * fx;
};

/**
 * Sample the terrain normal
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @returns {Vector} The surface normal vector at this point
 */
HeightMap.prototype.sampleNormal = function(x, y) {
    const doubleRadius = -(this.resolution + this.resolution);
    const left = this.sampleHeight(x - this.resolution, y);
    const top = this.sampleHeight(x, y - this.resolution);
    const right = this.sampleHeight(x + this.resolution, y);
    const bottom = this.sampleHeight(x, y + this.resolution);

    return new Vector(
        doubleRadius * (right - left),
        doubleRadius * doubleRadius,
        doubleRadius * (bottom - top)
    ).normalize();
};

/**
 * Change the height at a certain point
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @param {Number} amount The amount of change
 */
HeightMap.prototype.change = function(x, y, amount) {
    if (x < 0 || y < 0)
        return;

    x /= this.resolution;
    y /= this.resolution;

    const xi = Math.floor(x);
    const yi = Math.floor(y);

    if (xi >= this.xValues - 1 || yi >= this.yValues - 1)
        return;

    const fx = x - xi;
    const fy = y - yi;

    this.changePoint(xi, yi, fx * fy * amount);
    this.changePoint(xi + 1, yi, (1 - fx) * fy * amount);
    this.changePoint(xi, yi + 1, fx * (1 - fy) * amount);
    this.changePoint(xi + 1, yi + 1, (1 - fx) * (1 - fy) * amount);
};
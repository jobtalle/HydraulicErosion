/**
 * A height map for terrain generation
 * @param {HeightMapParameters} parameters Height map parameters
 * @param {Number} xValues The amount of X values to generate
 * @param {Number} yValues The amount of Y values to generate
 * @constructor
 */
const HeightMap = function(parameters, xValues, yValues) {
    this.parameters = parameters;
    this.xValues = xValues;
    this.yValues = yValues;
    this.values = new Array(xValues * yValues);
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
        noises.push(new CubicNoise(
            Math.ceil(scale * this.xValues),
            Math.ceil(scale * this.yValues)));

        scale *= this.parameters.falloff;
    }

    return noises;
};

/**
 * Calculate all height values
 */
HeightMap.prototype.generate = function() {
    const noises = this.createNoises();
};
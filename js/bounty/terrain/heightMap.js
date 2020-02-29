/**
 * A height map for terrain generation
 * @param {HeightMapParameters} parameters Height map parameters
 * @param {Number} xValues The amount of X values to generate
 * @param {Number} yValues The amount of Y values to generate
 * @param {Number} resolution The terrain resolution
 * @constructor
 */
const HeightMap = function(parameters, xValues, yValues, resolution) {
    this.parameters = parameters;
    this.xValues = xValues;
    this.yValues = yValues;
    this.resolution = resolution;
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
        noises[octave] = new CubicNoise(
            Math.ceil(scale * this.xValues),
            Math.ceil(scale * this.yValues));

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
    let influence = ((falloff - 1) * (falloff ** octaves)) / (falloff ** octaves - 1) / falloff;

    for (let octave = 0; octave < octaves; ++octave) {
        influences[octave] = influence;

        if (octave !== octaves - 1)
            influence /= falloff;
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
        let scale = this.parameters.scale * this.resolution;
        let height = 0;

        for (let octave = 0; octave < this.parameters.octaves; ++octave) {
            height += noises[octave].sample(x * scale, y * scale) * influences[octave];

            if (octave !== this.parameters.octaves - 1)
                scale *= this.parameters.scaleFalloff;
        }

        this.values[x + y * this.xValues] = (height ** 4) * this.parameters.amplitude * 2;
    }
};
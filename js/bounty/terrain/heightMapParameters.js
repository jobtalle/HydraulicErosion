/**
 * Parameters for height map generation
 * @param {Number} [octaves] The number of noises to add to a height map
 * @param {Number} [scale] The scale of the first noise that is added
 * @param {Number} [falloff] The rate of scale change for successive noises
 * @constructor
 */
const HeightMapParameters = function(
    octaves = 3,
    scale = .05,
    falloff = 2) {
    this.octaves = octaves;
    this.scale = scale;
    this.falloff = falloff;
};
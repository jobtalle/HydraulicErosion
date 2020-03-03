/**
 * Parameters for height map generation
 * @param {Number} [octaves] The number of noises to add to a height map
 * @param {Number} [scale] The scale of the first noise that is added
 * @param {Number} [influenceFalloff] The rate of amplitude change for successive noises
 * @param {Number} [scaleFalloff] The rate of scale change for successive noises
 * @param {Number} [amplitude] The amplitude of the height map
 * @param {Number} [heightPower] A power to apply to the height values
 * @constructor
 */
const HeightMapParameters = function(
    octaves = 6,
    scale = .12,
    influenceFalloff = .5,
    scaleFalloff = 1.6,
    amplitude = 35,
    heightPower = 3.5) {
    this.octaves = octaves;
    this.scale = scale;
    this.influenceFalloff = influenceFalloff;
    this.scaleFalloff = scaleFalloff;
    this.amplitude = amplitude;
    this.heightPower = heightPower;
};
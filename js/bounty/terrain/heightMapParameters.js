/**
 * Parameters for height map generation
 * @param {Number} [octaves] The number of noises to add to a height map
 * @param {Number} [scale] The scale of the first noise that is added
 * @param {Number} [influenceFalloff] The rate of amplitude change for successive noises
 * @param {Number} [scaleFalloff] The rate of scale change for successive noises
 * @param {Number} [amplitude] The amplitude of the height map
 * @param {Number} [heightPower] A power to apply to the height values
 * @param {Number} [volcanoThreshold] A height value above which volcanoes are created
 * @param {Number} [volcanoThresholdAmplitude] The amplitude of volcano threshold randomization
 * @param {Number} [volcanoThresholdScale] The scale of the volcano threshold randomization noise
 * @param {Number} [volcanoMaxDepth] The maximum volcano depth
 * @constructor
 */
const HeightMapParameters = function(
    octaves = 6,
    scale = .12,
    influenceFalloff = .44,
    scaleFalloff = 1.7,
    amplitude = 25,
    heightPower = 3.5,
    volcanoThreshold = 3.5,
    volcanoThresholdAmplitude = 1.6,
    volcanoThresholdScale = .2,
    volcanoMaxDepth = .8) {
    this.octaves = octaves;
    this.scale = scale;
    this.influenceFalloff = influenceFalloff;
    this.scaleFalloff = scaleFalloff;
    this.amplitude = amplitude;
    this.heightPower = heightPower;
    this.volcanoThreshold = volcanoThreshold;
    this.volcanoThresholdAmplitude = volcanoThresholdAmplitude;
    this.volcanoThresholdScale = volcanoThresholdScale;
    this.volcanoMaxDepth = volcanoMaxDepth;
};
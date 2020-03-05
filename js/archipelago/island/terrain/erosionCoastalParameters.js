/**
 * Parameters for coastal erosion simulation
 * @param {Number} [waveHeightMin] The minimum wave height
 * @param {Number} [waveHeightMax] The maximum wave height
 * @param {Number} [noiseScale] The scale of the variation noise
 * @param {Number} [power] The erosion power
 * @constructor
 */
const ErosionCoastalParameters = function(
    waveHeightMin = .2,
    waveHeightMax = 1,
    noiseScale = .4,
    power = 2.5) {
    this.waveHeightMin = waveHeightMin;
    this.waveHeightMax = waveHeightMax;
    this.noiseScale = noiseScale;
    this.power = power;
};
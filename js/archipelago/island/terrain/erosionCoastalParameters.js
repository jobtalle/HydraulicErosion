/**
 * Parameters for coastal erosion simulation
 * @param {Number} [waveHeightMin] The minimum wave height
 * @param {Number} [waveHeightMax] The maximum wave height
 * @param {Number} [noiseScale] The scale of the variation noise
 * @param {Number} [power] The  erosion power
 * @constructor
 */
const ErosionCoastalParameters = function(
    waveHeightMin = .4,
    waveHeightMax = 1.2,
    noiseScale = .5,
    power = 3) {
    this.waveHeightMin = waveHeightMin;
    this.waveHeightMax = waveHeightMax;
    this.noiseScale = noiseScale;
    this.power = power;
};
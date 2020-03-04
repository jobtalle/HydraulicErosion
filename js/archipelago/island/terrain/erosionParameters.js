/**
 * Parameters for the erosion simulation
 * @param {Number} [dropsPerCell] The number of drops per cell
 * @param {Number} [erosionRate] The rate of soil removal
 * @param {Number} [depositionRate] The percentage of soil that is deposited while eroding
 * @param {Number} [friction] Droplet friction
 * @param {Number} [acceleration] Droplet acceleration
 * @param {Number} [radius] The influence radius of a droplet
 * @param {Number} [steepnessThreshold] The threshold over which droplets start to erode soil
 * @param {Number} [steepnessInfluence] The influence of steepness on the erosion rate
 * @param {Number} [postBlur] The blur rate which will be applied after erosion
 * @param {Number} [sedimentMax] The maximum amount of sediment that can be carried
 * @param {Number} [sedimentUptakeMax] The maximum soil update per update
 * @param {Number} [sedimentEvaporateThreshold] The amount of carried sediment under which particles may disappear
 * @constructor
 */
const ErosionParameters = function(
    dropsPerCell = .8,
    erosionRate = .15,
    depositionRate = .035,
    friction = .9,
    acceleration = .22,
    radius = 1,
    steepnessThreshold = .01,
    steepnessInfluence = 0.8,
    postBlur = 1,
    sedimentMax = .17,
    sedimentUptakeMax = .007,
    sedimentEvaporateThreshold = .015) {
    this.dropsPerCell = dropsPerCell;
    this.erosionRate = erosionRate;
    this.depositionRate = depositionRate;
    this.friction = friction;
    this.acceleration = acceleration;
    this.radius = radius;
    this.steepnessThreshold = steepnessThreshold;
    this.steepnessInfluence = steepnessInfluence;
    this.postBlur = postBlur;
    this.sedimentMax = sedimentMax;
    this.sedimentUptakeMax = sedimentUptakeMax;
    this.sedimentEvaporateThreshold = sedimentEvaporateThreshold;
};
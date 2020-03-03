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
 * @constructor
 */
const ErosionParameters = function(
    dropsPerCell = .7,
    erosionRate = .11,
    depositionRate = .03,
    friction = .8,
    acceleration = .14,
    radius = 1.2,
    steepnessThreshold = .1,
    steepnessInfluence = 0.75,
    postBlur = .85) {
    this.dropsPerCell = dropsPerCell;
    this.erosionRate = erosionRate;
    this.depositionRate = depositionRate;
    this.friction = friction;
    this.acceleration = acceleration;
    this.radius = radius;
    this.steepnessThreshold = steepnessThreshold;
    this.steepnessInfluence = steepnessInfluence;
    this.postBlur = postBlur;
};
/**
 * Parameters for the erosion simulation
 * @param {Number} [dropsPerCell] The number of drops per cell
 * @param {Number} [erosionRate] The rate of soil removal
 * @param {Number} [depositionRate] The percentage of soil that is deposited while eroding
 * @param {Number} [friction] Droplet friction
 * @param {Number} [radius] The influence radius of a droplet
 * @param {Number} [steepnessThreshold] The threshold over which droplets start to erode soil
 * @param {Number} [steepnessInfluence] The influence of steepness on the erosion rate
 * @param {Number} [postBlur] The blur rate which will be applied after erosion
 * @constructor
 */
const ErosionParameters = function(
    dropsPerCell = .8,
    erosionRate = .19,
    depositionRate = .03,
    friction = .75,
    radius = 1.9,
    steepnessThreshold = .2,
    steepnessInfluence = 0.5,
    postBlur = 1) {
    this.dropsPerCell = dropsPerCell;
    this.erosionRate = erosionRate;
    this.depositionRate = depositionRate;
    this.friction = friction;
    this.radius = radius;
    this.steepnessThreshold = steepnessThreshold;
    this.steepnessInfluence = steepnessInfluence;
    this.postBlur = postBlur;
};
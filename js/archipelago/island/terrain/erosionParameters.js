/**
 * Parameters for the erosion simulation
 * @param {Number} [dropsPerCell] The number of drops per cell
 * @param {Number} [erosionRate] The rate of soil removal
 * @param {Number} [depositionRate] The percentage of soil that is deposited while eroding
 * @param {Number} [speed] Droplet speed
 * @param {Number} [radius] The influence radius of a droplet
 * @param {Number} [maxIterations] The maximum number of simulated iterations per drop
 * @param {Number} [postBlur] The blur rate which will be applied after erosion
 * @constructor
 */
const ErosionParameters = function(
    dropsPerCell = .5,
    erosionRate = .025,
    depositionRate = .025,
    speed = .28,
    radius = .7,
    maxIterations = 200,
    postBlur = 1) {
    this.dropsPerCell = dropsPerCell;
    this.erosionRate = erosionRate;
    this.depositionRate = depositionRate;
    this.speed = speed;
    this.radius = radius;
    this.maxIterations = maxIterations;
    this.postBlur = postBlur;
};
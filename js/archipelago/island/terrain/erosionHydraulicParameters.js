/**
 * Parameters for the hydraulic erosion simulation
 * @param {Number} [dropsPerCell] The number of drops per cell
 * @param {Number} [erosionRate] The rate of soil removal
 * @param {Number} [depositionRate] The percentage of soil that is deposited while eroding
 * @param {Number} [speed] Droplet speed
 * @param {Number} [friction] Droplet friction
 * @param {Number} [radius] The influence radius of a droplet
 * @param {Number} [maxIterations] The maximum number of simulated iterations per drop
 * @param {Number} [iterationScale] The influence of iteration on erosion effects
 * @constructor
 */
const ErosionHydraulicParameters = function(
    dropsPerCell = .4,
    erosionRate = .04,
    depositionRate = .03,
    speed = .15,
    friction = .7,
    radius = .8,
    maxIterations = 80,
    iterationScale = .04) {
    this.dropsPerCell = dropsPerCell;
    this.erosionRate = erosionRate;
    this.depositionRate = depositionRate;
    this.speed = speed;
    this.friction = friction;
    this.radius = radius;
    this.maxIterations = maxIterations;
    this.iterationScale = iterationScale;
};
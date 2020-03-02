/**
 * Parameters for the erosion simulation
 * @constructor
 */
const ErosionParameters = function(
    dropsPerCell = .8,
    erosionRate = .25,
    depositionRate = .05,
    friction = .85,
    radius = 2.5,
    steepnessInfluence = .9) {
    this.dropsPerCell = dropsPerCell;
    this.erosionRate = erosionRate;
    this.depositionRate = depositionRate;
    this.friction = friction;
    this.radius = radius;
    this.steepnessInfluence = steepnessInfluence;
};
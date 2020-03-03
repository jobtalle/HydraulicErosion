/**
 * Parameters for the erosion simulation
 * @constructor
 */
const ErosionParameters = function(
    dropsPerCell = 1,
    erosionRate = .2,
    depositionRate = .05,
    friction = .8,
    radius = 2.4,
    steepnessInfluence = .9) {
    this.dropsPerCell = dropsPerCell;
    this.erosionRate = erosionRate;
    this.depositionRate = depositionRate;
    this.friction = friction;
    this.radius = radius;
    this.steepnessInfluence = steepnessInfluence;
};
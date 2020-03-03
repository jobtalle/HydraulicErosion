/**
 * Parameters for the erosion simulation
 * @constructor
 */
const ErosionParameters = function(
    dropsPerCell = 1,
    erosionRate = .15,
    depositionRate = .05,
    friction = .8,
    radius = 2,
    steepnessInfluence = .85,
    postBlur = .8) {
    this.dropsPerCell = dropsPerCell;
    this.erosionRate = erosionRate;
    this.depositionRate = depositionRate;
    this.friction = friction;
    this.radius = radius;
    this.steepnessInfluence = steepnessInfluence;
    this.postBlur = postBlur;
};
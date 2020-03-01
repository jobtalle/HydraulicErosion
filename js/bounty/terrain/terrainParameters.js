/**
 * Parameters for terrain generation
 * @param {Number} [width] Terrain width
 * @param {Number} [height] Terrain height
 * @param {HeightMapParameters} [heightMapParameters] Parameters for height map generation
 * @param {String} [shape] A shape to mask the height map with
 * @param {Number} [shapePower] A power to apply to shapes
 * @constructor
 */
const TerrainParameters = function(
    width = 25,
    height = 40,
    heightMapParameters = new HeightMapParameters(),
    shape = TerrainParameters.SHAPE_CONE,
    shapePower = 2) {
    this.width = width;
    this.height = height;
    this.heightMapParameters = heightMapParameters;
    this.shape = shape;
    this.shapePower = shapePower;
};

TerrainParameters.SHAPE_CONE = "cone";
/**
 * Parameters for terrain generation
 * @param {Number} [width] Terrain width
 * @param {Number} [height] Terrain height
 * @param {String} [shape] A shape to mask the height map with
 * @param {Number} [shapePower] A power to apply to shapes
 * @param {HeightMapParameters} [heightMapParameters] Parameters for height map generation
 * @param {ErosionParameters} [erosionParameters] Parameters for erosion simulation
 * @constructor
 */
const TerrainParameters = function(
    width = 25,
    height = 40,
    shape = TerrainParameters.SHAPE_CONE,
    shapePower = 1.6,
    heightMapParameters = new HeightMapParameters(),
    erosionParameters = new ErosionParameters()) {
    this.width = width;
    this.height = height;
    this.shape = shape;
    this.shapePower = shapePower;
    this.heightMapParameters = heightMapParameters;
    this.erosionParameters = erosionParameters;
};

TerrainParameters.SHAPE_CONE = "cone";
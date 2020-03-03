/**
 * Parameters for terrain generation
 * @param {Number} [width] Terrain width
 * @param {Number} [height] Terrain height
 * @param {String} [shape] A shape to mask the height map with
 * @param {Number} [shapePower] A power to apply to shapes
 * @param {Number} [resolution] A height map & mesh grid resolution
 * @param {HeightMapParameters} [heightMapParameters] Parameters for height map generation
 * @param {ErosionParameters} [erosionParameters] Parameters for erosion simulation
 * @param {VolcanoesParameters} [volcanoesParameters] Parameters for volcano generation
 * @constructor
 */
const TerrainParameters = function(
    width = 25,
    height = 35,
    shape = TerrainParameters.SHAPE_CONE,
    shapePower = 1.55,
    resolution = .2,
    heightMapParameters = new HeightMapParameters(),
    erosionParameters = new ErosionParameters(),
    volcanoesParameters = new VolcanoesParameters()) {
    this.width = width;
    this.height = height;
    this.shape = shape;
    this.shapePower = shapePower;
    this.resolution = resolution;
    this.heightMapParameters = heightMapParameters;
    this.erosionParameters = erosionParameters;
    this.volcanoesParameters = volcanoesParameters;
};

TerrainParameters.SHAPE_CONE = "cone";
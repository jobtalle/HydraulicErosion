/**
 * Parameters for terrain generation
 * @param {Number} [width] Terrain width
 * @param {Number} [height] Terrain height
 * @param {Number} [water] Water level height
 * @param {String} [shape] A shape to mask the height map with
 * @param {Number} [shapePower] A power to apply to shapes
 * @param {Number} [resolution] A height map & mesh grid resolution
 * @param {HeightMapParameters} [heightMapParameters] Parameters for height map generation
 * @param {ErosionHydraulicParameters} [erosionHydraulicParameters] Parameters for hydraulic erosion simulation
 * @param {ErosionCoastalParameters} [erosionCoastalParameters] Parameters for coastal erosion simulation
 * @param {VolcanoesParameters} [volcanoesParameters] Parameters for volcano generation
 * @constructor
 */
const TerrainParameters = function(
    width = 25,
    height = 25,
    water = .5,
    shape = TerrainParameters.SHAPE_CONE,
    shapePower = 1.6,
    resolution = .1,
    heightMapParameters = new HeightMapParameters(),
    erosionHydraulicParameters = new ErosionHydraulicParameters(),
    erosionCoastalParameters = new ErosionCoastalParameters(),
    volcanoesParameters = new VolcanoesParameters()) {
    this.width = width;
    this.height = height;
    this.water = water;
    this.shape = shape;
    this.shapePower = shapePower;
    this.resolution = resolution;
    this.heightMapParameters = heightMapParameters;
    this.erosionHydraulicParameters = erosionHydraulicParameters;
    this.erosionCoastalParameters = erosionCoastalParameters;
    this.volcanoesParameters = volcanoesParameters;
};

TerrainParameters.SHAPE_CONE = "cone";
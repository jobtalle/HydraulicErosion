/**
 * Parameters for terrain generation
 * @param {Number} [width] Terrain width
 * @param {Number} [height] Terrain height
 * @param {HeightMapParameters} [heightMapParameters] Parameters for height map generation
 * @constructor
 */
const TerrainParameters = function(
    width = 20,
    height = 20,
    heightMapParameters = new HeightMapParameters()) {
    this.width = width;
    this.height = height;
    this.heightMapParameters = heightMapParameters;
};
/**
 * Parameters for island generation
 * @param {TerrainParameters} [terrainParameters] Parameters for terrain generation
 * @constructor
 */
const BountyParameters = function(
    terrainParameters = new TerrainParameters()) {
    this.terrainParameters = terrainParameters;
};
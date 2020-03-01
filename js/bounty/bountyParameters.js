/**
 * Parameters for island generation
 * @param {Number} [seed] An integer value in the range [0, 2^32 - 1] to use as a random seed
 * @param {TerrainParameters} [terrainParameters] Parameters for terrain generation
 * @constructor
 */
const BountyParameters = function(
    seed = Math.floor(Math.random() * 0xFFFF),
    terrainParameters = new TerrainParameters()) {
    this.seed = seed;
    this.terrainParameters = terrainParameters;
};
const SystemOcean = function(gl) {
    this.gl = gl;
    this.heightMaps = [];
    this.shader = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["mvp", "size", "height", "distanceField"],
        ["vertex"]);
    this.shaderThreshold = new Shader(
        gl,
        SystemOcean.DistanceField.prototype.SHADER_THRESHOLD_VERTEX,
        SystemOcean.DistanceField.prototype.SHADER_THRESHOLD_FRAGMENT,
        ["height", "size"],
        ["vertex"]);
    this.shaderVoronoi = new Shader(
        gl,
        SystemOcean.DistanceField.prototype.SHADER_VORONOI_VERTEX,
        SystemOcean.DistanceField.prototype.SHADER_VORONOI_FRAGMENT,
        ["source", "size", "step"],
        ["vertex"]);
};

SystemOcean.prototype.SHADER_VERTEX = `
#version 100

uniform mat4 mvp;
uniform mediump vec2 size;
uniform mediump float height;

attribute mediump vec2 vertex;

varying mediump vec2 uv;

void main() {
  uv = vertex.xy / size;
  gl_Position = mvp * vec4(vertex.x, height, vertex.y, 1.0);
}
`;

SystemOcean.prototype.SHADER_FRAGMENT = `
#version 100

uniform sampler2D distanceField;
uniform mediump vec2 size;

varying mediump vec2 uv;

void main() {
  lowp float shoreDistance = length((texture2D(distanceField, uv).xy - uv) * size);
  
  gl_FragColor = texture2D(distanceField, uv);
  
  if (shoreDistance > 0.4 && shoreDistance < 0.8)
    gl_FragColor = vec4(1.0);
}
`;

/**
 * Make a height map
 * @param {Number} xValues The number of X values
 * @param {Number} yValues The number of Y values
 * @param {Array} values An array containing all height values
 * @param {Number} resolution The spacing between the values
 * @param {SystemTerrain.HeightMap} terrainHeightMap The terrain height map
 * @param {Number} height The water height
 * @returns {SystemOcean.HeightMap} The terrain object
 */
SystemOcean.prototype.makeHeightMap = function(
    xValues,
    yValues,
    values,
    resolution,
    terrainHeightMap,
    height) {
    return new SystemOcean.HeightMap(
        this.heightMaps,
        this.gl,
        xValues,
        yValues,
        values,
        resolution,
        terrainHeightMap,
        height,
        this.shaderThreshold,
        this.shaderVoronoi);
};

/**
 * Draw the ocean
 * @param {Array} mvp An array containing the values of the MVP matrix
 */
SystemOcean.prototype.draw = function(mvp) {
    this.shader.use();
    this.gl.uniformMatrix4fv(this.shader.uMvp, false, mvp);

    for (const heightMap of this.heightMaps)
        heightMap.draw(this.shader);
};
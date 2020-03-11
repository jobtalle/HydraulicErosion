const SystemOcean = function(gl) {
    this.gl = gl;
    this.heightMaps = [];
    this.phase = 0;
    this.shader = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["mvp", "height", "distanceField", "phase"],
        ["vertex", "uv"]);
    this.shaderThreshold = new Shader(
        gl,
        SystemOcean.DistanceField.prototype.SHADER_THRESHOLD_VERTEX,
        SystemOcean.DistanceField.prototype.SHADER_THRESHOLD_FRAGMENT,
        ["height", "size", "shoreLength"],
        ["vertex"]);
    this.shaderVoronoi = new Shader(
        gl,
        SystemOcean.DistanceField.prototype.SHADER_VORONOI_VERTEX,
        SystemOcean.DistanceField.prototype.SHADER_VORONOI_FRAGMENT,
        ["source", "size", "step"],
        ["vertex"]);
    this.shaderFinal = new Shader(
        gl,
        SystemOcean.DistanceField.prototype.SHADER_FINAL_VERTEX,
        SystemOcean.DistanceField.prototype.SHADER_FINAL_FRAGMENT,
        ["source", "size", "shoreLength"],
        ["vertex"]);
};

SystemOcean.prototype.SHADER_VERTEX = `
#version 100

precision mediump float;

uniform mat4 mvp;
uniform float height;

attribute vec2 vertex;
attribute vec2 uv;

varying vec2 iUv;

void main() {
  iUv = uv;
  
  gl_Position = mvp * vec4(vertex.x, height, vertex.y, 1.0);
}
`;

SystemOcean.prototype.SHADER_FRAGMENT = `
#version 100

precision mediump float;

uniform sampler2D distanceField;
uniform vec2 size;
uniform float phase;

varying vec2 iUv;

void main() {
  float shoreDistance = texture2D(distanceField, iUv).x;

  gl_FragColor = vec4(texture2D(distanceField, iUv).rgb, 0.5);
  
  if (shoreDistance > (1.0 - phase) && shoreDistance < min(0.999999, (1.0 - phase) + 0.05))
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
 * @param {HeightMap} heightMap The height map
 * @param {Number} height The water height
 * @returns {SystemOcean.HeightMap} The terrain object
 */
SystemOcean.prototype.makeHeightMap = function(
    xValues,
    yValues,
    values,
    resolution,
    terrainHeightMap,
    heightMap,
    height) {
    return new SystemOcean.HeightMap(
        this.heightMaps,
        this.gl,
        terrainHeightMap,
        heightMap,
        height,
        this.shaderThreshold,
        this.shaderVoronoi,
        this.shaderFinal);
};

/**
 * Update the ocean renderer
 * @param {Number} timeStep Passed time in seconds
 */
SystemOcean.prototype.update = function(timeStep) {
    this.phase += timeStep * .1;

    if (this.phase > 1)
        --this.phase;
};

/**
 * Draw the ocean
 * @param {Array} mvp An array containing the values of the MVP matrix
 */
SystemOcean.prototype.draw = function(mvp) {
    this.shader.use();
    this.gl.uniformMatrix4fv(this.shader.uMvp, false, mvp);
    this.gl.uniform1f(this.shader.uPhase, this.phase);

    for (const heightMap of this.heightMaps)
        heightMap.draw(this.shader);
};
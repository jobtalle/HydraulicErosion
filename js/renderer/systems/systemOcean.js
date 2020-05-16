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

SystemOcean.prototype.SHADER_HEIGHT = `
  float wave = 0.5 + 0.5 * cos(4.0 * (pow(shoreDistance, 0.65) + phase) * 6.283185);
`;

SystemOcean.prototype.SHADER_VERTEX = `
#version 100

precision mediump float;

uniform mat4 mvp;
uniform float height;
uniform sampler2D distanceField;
uniform float phase;

attribute vec2 vertex;
attribute vec2 uv;

varying vec2 iUv;
varying float a;

void main() {
  float shoreDistance = texture2D(distanceField, uv).x;
  float s = 1.2;
  a = 0.5 + 0.5 * cos(uv.x * 20.0 * s) * sin(uv.y * 40.0 * s);
` + SystemOcean.prototype.SHADER_HEIGHT + `

  iUv = uv;
  
  float waveHeight = 0.1 * pow(wave, 2.0) * (1.0 - shoreDistance) * (1.0 - a);
  
  gl_Position = mvp * vec4(vertex.x, height + waveHeight, vertex.y, 1.0);
}
`;

SystemOcean.prototype.SHADER_FRAGMENT = `
#version 100

precision mediump float;

uniform sampler2D distanceField;
uniform vec2 size;
uniform float phase;

varying vec2 iUv;
varying float a;

void main() {
  float shoreDistance = texture2D(distanceField, iUv).x;
` + SystemOcean.prototype.SHADER_HEIGHT + `

  gl_FragColor = vec4(0.2, 0.4, 0.6, 1.0);
  
  if (shoreDistance < 0.03 || shoreDistance != 1.0 && wave > 0.75 + a * 0.4)
    gl_FragColor.rgb += vec3(pow(1.0 - shoreDistance, 2.5));
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
    this.phase += timeStep * .08;

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
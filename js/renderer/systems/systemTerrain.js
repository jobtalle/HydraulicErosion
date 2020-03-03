/**
 * The terrain renderer
 * @param {WebGLRenderingContext} gl The WebGL 1 context
 * @constructor
 */
const SystemTerrain = function(gl) {
    this.gl = gl;
    this.heightMaps = [];
    this.shader = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["mvp"],
        ["vertex", "normal"]);
};

SystemTerrain.prototype.SHADER_VERTEX = `
#version 100

uniform mat4 mvp;

attribute mediump vec3 vertex;
attribute mediump vec3 normal;

varying mediump vec3 iNormal;
varying mediump float h;

void main() {
  iNormal = normal;
  h = vertex.y;
  gl_Position = mvp * vec4(vertex, 1.0);
}
`;

SystemTerrain.prototype.SHADER_FRAGMENT = `
#version 100

varying mediump vec3 iNormal;
varying mediump float h;

void main() {
  if (h < 0.1)
    discard;
  
  gl_FragColor = vec4(vec3(1.0) * (0.3 + 0.7 * max(0.0, dot(normalize(iNormal), normalize(vec3(0.5, -1.0, 0.5))))), 1.0);
}
`;

/**
 * Make a height map
 * @param {Number} xValues The number of X values
 * @param {Number} yValues The number of Y values
 * @param {Array} values An array containing all height values
 * @param {Number} resolution The spacing between the values
 * @returns {SystemTerrain.HeightMap} The terrain object
 */
SystemTerrain.prototype.makeHeightMap = function(
    xValues,
    yValues,
    values,
    resolution) {
    return new SystemTerrain.HeightMap(this.heightMaps, this.gl, xValues, yValues, values, resolution);
};

/**
 * Draw all terrain
 * @param {Array} mvp An array containing the values of the MVP matrix
 */
SystemTerrain.prototype.draw = function(mvp) {
    this.shader.use();
    this.gl.uniformMatrix4fv(this.shader.uMvp, false, mvp);

    for (const heightMap of this.heightMaps)
        heightMap.draw(this.shader);
};
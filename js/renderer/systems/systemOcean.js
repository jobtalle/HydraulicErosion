const SystemOcean = function(gl) {
    this.gl = gl;
    this.heightMaps = [];
    this.shader = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["mvp"],
        ["vertex"]);
};

SystemOcean.prototype.SHADER_VERTEX = `
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

SystemOcean.prototype.SHADER_FRAGMENT = `
#version 100

varying mediump vec3 iNormal;
varying mediump float h;

void main() {
  // if (h < 0.25)
  //   discard;
  gl_FragColor = vec4(vec3(h * 0.15 + 0.2) * (0.3 + 0.7 * max(0.0, dot(normalize(iNormal), normalize(vec3(0.5, -1.0, 0.5))))), 1.0);
}
`;

/**
 * Make a height map
 * @param {Number} xValues The number of X values
 * @param {Number} yValues The number of Y values
 * @param {Array} values An array containing all height values
 * @param {Number} resolution The spacing between the values
 * @returns {SystemOcean.HeightMap} The terrain object
 */
SystemOcean.prototype.makeHeightMap = function(
    xValues,
    yValues,
    values,
    resolution) {
    return new SystemOcean.HeightMap(this.heightMaps, this.gl, xValues, yValues, values, resolution);
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
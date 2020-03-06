const SystemOcean = function(gl) {
    this.gl = gl;
    this.heightMaps = [];
    this.shader = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["mvp", "height"],
        ["vertex"]);
};

SystemOcean.prototype.SHADER_VERTEX = `
#version 100

uniform mat4 mvp;
uniform mediump float height;

attribute mediump vec2 vertex;

void main() {
  gl_Position = mvp * vec4(vertex.x, height, vertex.y, 1.0);
}
`;

SystemOcean.prototype.SHADER_FRAGMENT = `
#version 100

void main() {
  gl_FragColor = vec4(0.2, 0.2, 0.9, 0.5);
}
`;

/**
 * Make a height map
 * @param {Number} xValues The number of X values
 * @param {Number} yValues The number of Y values
 * @param {Array} values An array containing all height values
 * @param {Number} resolution The spacing between the values
 * @param {Number} height The water height
 * @returns {SystemOcean.HeightMap} The terrain object
 */
SystemOcean.prototype.makeHeightMap = function(
    xValues,
    yValues,
    values,
    resolution,
    height) {
    return new SystemOcean.HeightMap(this.heightMaps, this.gl, xValues, yValues, values, resolution, height);
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
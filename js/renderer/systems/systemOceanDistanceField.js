/**
 * A distance field for ocean wave sampling
 * @param {WebGLRenderingContext} gl The WebGL 1 rendering context
 * @param {Number} xValues The number of X values
 * @param {Number} yValues The number of Y values
 * @param {Array} values An array containing all height values
 * @param {Number} resolution The spacing between the values
 * @param {Number} waterHeight The water height
 * @param {SystemTerrain.HeightMap} terrainHeightMap The terrain height map
 * @param {Shader} shaderThreshold The height map threshold shader
 * @constructor
 */
SystemOcean.DistanceField = function(
    gl,
    xValues,
    yValues,
    values,
    resolution,
    waterHeight,
    terrainHeightMap,
    shaderThreshold) {
    this.gl = gl;
    this.xValues = xValues;
    this.yValues = yValues;
    this.width = this.RESOLUTION * (xValues - 1);
    this.height = this.RESOLUTION * (yValues - 1);
    this.values = values;
    this.resolution = resolution;
    this.waterHeight = waterHeight;
    this.terrainHeightMap = terrainHeightMap;
    this.texture = this.build(shaderThreshold);
};

SystemOcean.DistanceField.prototype.RESOLUTION = 8;

SystemOcean.DistanceField.prototype.SHADER_THRESHOLD_VERTEX = `
#version 100

uniform mediump vec2 size;

attribute mediump vec3 vertex;

varying mediump float y;

void main() {
  y = vertex.y;
  gl_Position = vec4(2.0 * vertex.xz / size - vec2(1.0), 0.0, 1.0);
}
`;

SystemOcean.DistanceField.prototype.SHADER_THRESHOLD_FRAGMENT = `
#version 100

uniform mediump float height;

varying mediump float y;

void main() {
  if (y > height)
    gl_FragColor = vec4(1.0);
  else
    gl_FragColor = vec4(0.0);
}
`;

/**
 * Build the distance field
 * @param {Shader} shaderThreshold The height map threshold shader
 * @returns {WebGLTexture} The distance field texture
 */
SystemOcean.DistanceField.prototype.build = function(shaderThreshold) {
    const pairs = [
        this.createTexturePair(this.width, this.height),
        this.createTexturePair(this.width, this.height)
    ];

    let current = 0;

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, pairs[current].framebuffer);
    this.gl.viewport(0, 0, this.width, this.height);

    shaderThreshold.use();

    this.gl.uniform2f(
        shaderThreshold.uSize,
        (this.xValues - 1) * this.resolution,
        (this.yValues - 1) * this.resolution);
    this.gl.uniform1f(shaderThreshold.uHeight, this.waterHeight);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.terrainHeightMap.vertices);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.terrainHeightMap.indices);

    this.gl.enableVertexAttribArray(shaderThreshold.aVertex);
    this.gl.vertexAttribPointer(shaderThreshold.aVertex, 3, this.gl.FLOAT, false, 24, 0);

    this.gl.drawElements(this.gl.TRIANGLES, this.terrainHeightMap.indexCount, this.gl.UNSIGNED_INT, 0);

    // Loopity loop

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    this.gl.deleteFramebuffer(pairs[current].framebuffer);
    this.gl.deleteFramebuffer(pairs[1 - current].framebuffer);
    this.gl.deleteTexture(pairs[1 - current].texture);

    return pairs[current].texture;
};

/**
 * Create a texture and its corresponding fbo
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 */
SystemOcean.DistanceField.prototype.createTexturePair = function(width, height) {
    const pair = {
        texture: this.gl.createTexture(),
        framebuffer: this.gl.createFramebuffer()
    };

    this.gl.bindTexture(this.gl.TEXTURE_2D, pair.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.width,
        this.height,
        0,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        new Uint8Array(width * height << 2).fill(100));

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, pair.framebuffer);
    this.gl.framebufferTexture2D(
        this.gl.FRAMEBUFFER,
        this.gl.COLOR_ATTACHMENT0,
        this.gl.TEXTURE_2D,
        pair.texture,
        0);

    return pair;
};

/**
 * Free this distance field
 */
SystemOcean.DistanceField.prototype.free = function() {
    this.gl.deleteTexture(this.texture);
};
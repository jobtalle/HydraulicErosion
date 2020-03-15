/**
 * A distance field for ocean wave sampling
 * @param {WebGLRenderingContext} gl The WebGL 1 rendering context
 * @param {Number} terrainWidth The terrain width
 * @param {Number} terrainHeight The terrain height
 * @param {Number} waterHeight The water height
 * @param {SystemTerrain.HeightMap} terrainHeightMap The terrain height map
 * @param {Shader} shaderThreshold The height map threshold shader
 * @param {Shader} shaderVoronoi The voronoi shader
 * @param {Shader} shaderFinal The final distance field shader
 * @constructor
 */
SystemOcean.DistanceField = function(
    gl,
    terrainWidth,
    terrainHeight,
    waterHeight,
    terrainHeightMap,
    shaderThreshold,
    shaderVoronoi,
    shaderFinal) {
    this.gl = gl;
    this.terrainWidth = terrainWidth;
    this.terrainHeight = terrainHeight;
    this.shoreLengthPixels = this.SHORE_LENGTH * this.RESOLUTION;
    this.width = Math.round(this.terrainWidth * this.RESOLUTION + this.shoreLengthPixels * 2);
    this.height = Math.round(this.terrainHeight * this.RESOLUTION + this.shoreLengthPixels * 2);
    this.waterHeight = waterHeight;
    this.terrainHeightMap = terrainHeightMap;
    this.texture = this.build(shaderThreshold, shaderVoronoi, shaderFinal);
};

SystemOcean.DistanceField.prototype.RESOLUTION = 24;
SystemOcean.DistanceField.prototype.SHORE_LENGTH = 3;

SystemOcean.DistanceField.prototype.SHADER_THRESHOLD_VERTEX = `
#version 100

precision mediump float;

uniform vec2 size;
uniform float shoreLength;

attribute vec3 vertex;

varying vec2 uv;
varying float y;

void main() {
  uv = (vertex.xz + vec2(shoreLength)) / (size + vec2(2.0 * shoreLength));
  y = vertex.y;
  gl_Position = vec4(2.0 * uv - vec2(1.0), 0.0, 1.0);
}
`;

SystemOcean.DistanceField.prototype.SHADER_THRESHOLD_FRAGMENT = `
#version 100

precision mediump float;

uniform float height;

varying vec2 uv;
varying float y;

void main() {
  if (y > height)
    gl_FragColor = vec4(uv, 0.0, 1.0);
  else
    gl_FragColor = vec4(-1.0);
}
`;

SystemOcean.DistanceField.prototype.SHADER_VORONOI_VERTEX = `
#version 100

precision mediump float;

attribute vec2 vertex;

varying vec2 uv;

void main() {
  uv = vertex;
  gl_Position = vec4(2.0 * vertex - vec2(1.0), 0.0, 1.0);
}
`;

SystemOcean.DistanceField.prototype.SHADER_VORONOI_FRAGMENT = `
#version 100

precision mediump float;

uniform sampler2D source;
uniform vec2 size;
uniform int step;

varying vec2 uv;

void main() {
  float bestDistance = 16000000.0;
  vec4 bestPixel = vec4(0.0);
  
  for (int y = -1; y < 2; ++y) for (int x = -1; x < 2; ++x) {
    vec4 pixel = texture2D(source, uv + vec2(float(x), float(y)) * float(step) / size);
    vec2 delta = (pixel.xy - uv) * size;
    float distance = dot(delta, delta);
    
    if (pixel.a != 0.0 && distance < bestDistance) {
      bestDistance = distance;
      bestPixel = pixel;
    }
  }
  
  gl_FragColor = bestPixel;
}
`;

SystemOcean.DistanceField.prototype.SHADER_FINAL_VERTEX = `
#version 100

precision mediump float;

attribute vec2 vertex;

varying vec2 uv;

void main() {
  uv = vertex;
  gl_Position = vec4(2.0 * uv - vec2(1.0), 0.0, 1.0);
}
`;

SystemOcean.DistanceField.prototype.SHADER_FINAL_FRAGMENT = `
#version 100

precision mediump float;

uniform sampler2D source;
uniform float shoreLength;
uniform vec2 size;

varying vec2 uv;

void main() {
  vec2 shoreDelta = (texture2D(source, uv).xy - uv) * size;
  float shoreDist = length(shoreDelta);
  vec2 shoreDirection = vec2(0.0);
  
  if (shoreDist != 0.0)
    shoreDirection = normalize(shoreDelta);
  
  gl_FragColor = vec4(min(1.0, shoreDist / shoreLength), shoreDirection * 0.5 + vec2(0.5), 1.0);
}
`;

/**
 * Build the distance field
 * @param {Shader} shaderThreshold The height map threshold shader
 * @param {Shader} shaderVoronoi The voronoi shader
 * @param {Shader} shaderFinal The final distance field shader
 * @returns {WebGLTexture} The distance field texture
 */
SystemOcean.DistanceField.prototype.build = function(
    shaderThreshold,
    shaderVoronoi,
    shaderFinal) {
    const texture = this.gl.createTexture();
    const framebuffer = this.gl.createFramebuffer();
    const quad = this.gl.createBuffer();
    const pairs = [
        this.createTexturePair(this.width, this.height),
        this.createTexturePair(this.width, this.height)
    ];
    let step = 1;
    let current = 0;

    while (step < this.shoreLengthPixels * .5)
        step <<= 1;

    // Create output texture
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
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
        null);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
    this.gl.framebufferTexture2D(
        this.gl.FRAMEBUFFER,
        this.gl.COLOR_ATTACHMENT0,
        this.gl.TEXTURE_2D,
        texture,
        0);

    // Upload a quad
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, quad);
    this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
        this.gl.STATIC_DRAW);

    // Blit the terrain shape onto the current buffer
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, pairs[current].framebuffer);
    this.gl.viewport(0, 0, this.width, this.height);

    shaderThreshold.use();

    this.gl.uniform2f(shaderThreshold.uSize, this.terrainWidth, this.terrainHeight);
    this.gl.uniform1f(shaderThreshold.uHeight, this.waterHeight);
    this.gl.uniform1f(shaderThreshold.uShoreLength, this.SHORE_LENGTH);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.terrainHeightMap.vertices);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.terrainHeightMap.indices);

    this.gl.enableVertexAttribArray(shaderThreshold.aVertex);
    this.gl.vertexAttribPointer(shaderThreshold.aVertex, 3, this.gl.FLOAT, false, 24, 0);

    // Disable attributes that were used by normal terrain rendering
    this.gl.disableVertexAttribArray(1);

    this.gl.drawElements(this.gl.TRIANGLES, this.terrainHeightMap.indexCount, this.gl.UNSIGNED_INT, 0);

    // Create the voronoi diagram
    shaderVoronoi.use();

    this.gl.uniform1i(shaderVoronoi.uSource, 0);
    this.gl.uniform2f(shaderVoronoi.uSize, this.width, this.height);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, quad);

    this.gl.enableVertexAttribArray(shaderVoronoi.aVertex);
    this.gl.vertexAttribPointer(shaderVoronoi.aVertex, 2, this.gl.FLOAT, false, 8, 0);

    this.gl.activeTexture(this.gl.TEXTURE0);

    while (step !== 0) {
        current = 1 - current;

        this.gl.uniform1i(shaderVoronoi.uStep, step);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, pairs[current].framebuffer);
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.bindTexture(this.gl.TEXTURE_2D, pairs[1 - current].texture);

        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);

        step >>= 1;
    }

    // Blit final texture
    shaderFinal.use();

    this.gl.uniform1i(shaderFinal.uSource, 0);
    this.gl.uniform2f(shaderFinal.uSize, this.width, this.height);
    this.gl.uniform1f(shaderFinal.uShoreLength, this.shoreLengthPixels);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, quad);

    this.gl.enableVertexAttribArray(shaderFinal.aVertex);
    this.gl.vertexAttribPointer(shaderFinal.aVertex, 2, this.gl.FLOAT, false, 8, 0);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
    this.gl.viewport(0, 0, this.width, this.height);
    this.gl.bindTexture(this.gl.TEXTURE_2D, pairs[current].texture);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);

    // Free memory
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.deleteFramebuffer(framebuffer);
    this.gl.deleteFramebuffer(pairs[current].framebuffer);
    this.gl.deleteFramebuffer(pairs[1 - current].framebuffer);
    this.gl.deleteTexture(pairs[current].texture);
    this.gl.deleteTexture(pairs[1 - current].texture);
    this.gl.deleteBuffer(quad);

    return texture;
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
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
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
        this.gl.FLOAT,
        null);

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
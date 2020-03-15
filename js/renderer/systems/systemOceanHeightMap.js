/**
 * Water surrounding a height map
 * @param {Array} container The array in which to store the reference to this height map
 * @param {WebGLRenderingContext} gl The WebGL 1 rendering context
 * @param {SystemTerrain.HeightMap} terrainHeightMap The terrain height map
 * @param {HeightMap} heightMap The height map
 * @param {Number} waterHeight The water height
 * @param {Shader} shaderThreshold The height map threshold shader
 * @param {Shader} shaderVoronoi The voronoi shader
 * @param {Shader} shaderFinal The final distance field shader
 * @constructor
 */
SystemOcean.HeightMap = function(
    container,
    gl,
    terrainHeightMap,
    heightMap,
    waterHeight,
    shaderThreshold,
    shaderVoronoi,
    shaderFinal) {
    this.container = container;
    this.gl = gl;
    this.heightMap = heightMap;
    this.waterHeight = waterHeight;
    this.vertices = gl.createBuffer();
    this.indices = gl.createBuffer();
    this.indexCount = 0;

    this.distanceField = new SystemOcean.DistanceField(
        gl,
        (heightMap.xValues - 1) * heightMap.resolution,
        (heightMap.yValues - 1) * heightMap.resolution,
        waterHeight,
        terrainHeightMap,
        shaderThreshold,
        shaderVoronoi,
        shaderFinal);

    this.build();
    this.container.push(this);
};

SystemOcean.HeightMap.prototype.RESOLUTION = .1;

/**
 * Build the water model surrounding the height map
 */
SystemOcean.HeightMap.prototype.build = function() {
    const width = this.heightMap.getWidth() + 2 * this.distanceField.SHORE_LENGTH;
    const height = this.heightMap.getHeight() + 2 * this.distanceField.SHORE_LENGTH;
    const xValues = Math.ceil(width / this.RESOLUTION) + 1;
    const yValues = Math.ceil(height / this.RESOLUTION) + 1;
    const xStep = width / (xValues - 1);
    const yStep = height / (yValues - 1);
    const vertices = new Array(xValues * yValues * 4);
    const indices = [];

    for (let y = 0; y < yValues; ++y) for (let x = 0; x < xValues; ++x) {
        const index = (x + y * xValues) << 2;

        vertices[index] = x * xStep - this.distanceField.SHORE_LENGTH;
        vertices[index + 1] = y * yStep - this.distanceField.SHORE_LENGTH;
        vertices[index + 2] = x / (xValues - 1);
        vertices[index + 3] = y / (yValues - 1);

        if (x < xValues - 1 && y < yValues - 1) {
            const iLeftTop = x + y * xValues;
            const iRightTop = iLeftTop + 1;
            const iLeftBottom = x + (y + 1) * xValues;
            const iRightBottom = iLeftBottom + 1;

            const hLeftTop = this.heightMap.sampler.sample(
                x * xStep - this.distanceField.SHORE_LENGTH,
                y * yStep - this.distanceField.SHORE_LENGTH);
            const hRightTop = this.heightMap.sampler.sample(
                (x + 1) * xStep - this.distanceField.SHORE_LENGTH,
                y * yStep - this.distanceField.SHORE_LENGTH);
            const hLeftBottom = this.heightMap.sampler.sample(
                x * xStep - this.distanceField.SHORE_LENGTH,
                (y + 1) * yStep - this.distanceField.SHORE_LENGTH);
            const hRightBottom = this.heightMap.sampler.sample(
                (x + 1) * xStep - this.distanceField.SHORE_LENGTH,
                (y + 1) * yStep - this.distanceField.SHORE_LENGTH);
            const height = this.waterHeight + 0.1; // TODO: Added max wave height

            if (hLeftBottom < height ||
                hLeftTop < height ||
                hRightTop < height)
                indices.push(
                    iLeftBottom,
                    iLeftTop,
                    iRightTop);

            if (hRightTop < height ||
                hRightBottom < height ||
                hLeftBottom < height)
                indices.push(
                    iRightTop,
                    iRightBottom,
                    iLeftBottom);
        }
    }

    this.indexCount = indices.length;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertices);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), this.gl.STATIC_DRAW);
};

/**
 * Draw this water
 * @param {Shader} shader The active shader
 */
SystemOcean.HeightMap.prototype.draw = function(shader) {
    this.gl.uniform1f(shader.uHeight, this.waterHeight);
    this.gl.uniform1i(shader.uDistanceField, 0);
    this.gl.uniform1f(shader.uShoreLength, this.distanceField.SHORE_LENGTH);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.distanceField.texture);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertices);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices);

    this.gl.enableVertexAttribArray(shader.aVertex);
    this.gl.vertexAttribPointer(shader.aVertex, 2, this.gl.FLOAT, false, 16, 0);
    this.gl.enableVertexAttribArray(shader.aUv);
    this.gl.vertexAttribPointer(shader.aUv, 2, this.gl.FLOAT, false, 16, 8);

    this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_INT, 0);
};

/**
 * Free this height map
 */
SystemOcean.HeightMap.prototype.free = function() {
    this.distanceField.free();

    this.gl.deleteBuffer(this.vertices);
    this.gl.deleteBuffer(this.indices);
    this.container.splice(this.container.indexOf(this), 1);
};
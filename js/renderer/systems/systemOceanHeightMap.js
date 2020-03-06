/**
 * Water surrounding a height map
 * @param {Array} container The array in which to store the reference to this height map
 * @param {WebGLRenderingContext} gl The WebGL 1 rendering context
 * @param {Number} xValues The number of X values
 * @param {Number} yValues The number of Y values
 * @param {Array} values An array containing all height values
 * @param {Number} resolution The spacing between the values
 * @param {Number} height The water height
 * @constructor
 */
SystemOcean.HeightMap = function(
    container,
    gl,
    xValues,
    yValues,
    values,
    resolution,
    height) {
    this.container = container;
    this.gl = gl;
    this.xValues = xValues;
    this.yValues = yValues;
    this.values = values;
    this.resolution = resolution;
    this.height = height;
    this.vertices = gl.createBuffer();
    this.indices = gl.createBuffer();
    this.indexCount = 0;

    this.container.push(this);
    this.build();
};

/**
 * Build the water model surrounding the height map
 */
SystemOcean.HeightMap.prototype.build = function() {
    const vertices = new Array(this.values.length * 2);
    const indices = [];

    for (let y = 0; y < this.yValues; ++y) for (let x = 0; x < this.xValues; ++x) {
        const index = (x + y * this.xValues) * 2;

        vertices[index] = x * this.resolution;
        vertices[index + 1] = y * this.resolution;
    }

    for (let y = 0; y < this.yValues - 1; ++y) for (let x = 0; x < this.xValues - 1; ++x) {
        const iLeftTop = x + y * this.xValues;
        const iRightTop = iLeftTop + 1;
        const iLeftBottom = x + (y + 1) * this.xValues;
        const iRightBottom = iLeftBottom + 1;
        const hLeftTop = this.values[iLeftTop];
        const hRightTop = this.values[iRightTop];
        const hLeftBottom = this.values[iLeftBottom];
        const hRightBottom = this.values[iRightBottom];

        // TODO: Add maximum wave height to height threshold
        if (hLeftTop > this.height &&
            hRightTop > this.height &&
            hLeftBottom > this.height &&
            hRightBottom > this.height)
            continue;

        indices.push(
            iLeftBottom,
            iLeftTop,
            iRightTop,
            iRightTop,
            iRightBottom,
            iLeftBottom);
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
    this.gl.uniform1f(shader.uHeight, this.height);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertices);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices);

    this.gl.enableVertexAttribArray(shader.aVertex);
    this.gl.vertexAttribPointer(shader.aVertex, 2, this.gl.FLOAT, false, 8, 0);

    this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_INT, 0);
};

/**
 * Free this height map
 */
SystemOcean.HeightMap.prototype.free = function() {
    this.gl.deleteBuffer(this.vertices);
    this.gl.deleteBuffer(this.indices);
    this.container.splice(this.container.indexOf(this), 1);
};
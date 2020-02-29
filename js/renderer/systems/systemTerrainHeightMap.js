/**
 * A height map rendered by the terrain renderer
 * @param {Array} container The array in which to store the reference to this height map
 * @param {WebGLRenderingContext} gl The WebGL 1 rendering context
 * @param {Number} xValues The number of X values
 * @param {Number} yValues The number of Y values
 * @param {Array} values An array containing all height values
 * @param {Number} resolution The spacing between the values
 * @constructor
 */
SystemTerrain.HeightMap = function(
    container,
    gl,
    xValues,
    yValues,
    values,
    resolution) {
    this.container = container;
    this.gl = gl;
    this.xValues = xValues;
    this.yValues = yValues;
    this.values = values;
    this.resolution = resolution;
    this.vertices = gl.createBuffer();
    this.indices = gl.createBuffer();
    this.indexCount = 0;

    this.container.push(this);
    this.build();
};

/**
 * Build the height map data & upload it to the buffers
 */
SystemTerrain.HeightMap.prototype.build = function() {
    const vertices = new Array(this.values.length * 3);
    const indices = [];

    for (let y = 0; y < this.yValues; ++y) for (let x = 0; x < this.xValues; ++x) {
        const index = x + y * this.xValues;

        vertices[3 * index] = x * this.resolution;
        vertices[3 * index + 1] = this.values[x + y * this.xValues];
        vertices[3 * index + 2] = y * this.resolution;

        if (x !== this.xValues - 1 && y !== this.yValues - 1) {
            indices.push(
                x + y * this.xValues,
                x + y * this.xValues + 1,
                x + (y + 1) * this.xValues,
                x + (y + 1) * this.xValues,
                x + y * this.xValues + 1,
                x + (y + 1) * this.xValues + 1);
        }
    }

    this.indexCount = indices.length;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertices);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
};

/**
 * Draw this height map
 */
SystemTerrain.HeightMap.prototype.draw = function() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertices);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices);
    this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
};

/**
 * Free this height map
 */
SystemTerrain.HeightMap.prototype.free = function() {
    this.gl.deleteBuffer(this.vertices);
    this.gl.deleteBuffer(this.indices);
    this.container.splice(this.container.indexOf(this), 1);
};
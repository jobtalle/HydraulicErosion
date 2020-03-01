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
 * Calculate the normals for a set of terrain vertices
 * @param {Array} vertices The vertex buffer
 * @param {Number} vertexOffset The index offset of vertex coordinates
 * @param {Number} normalOffset The index offset to write the normals to
 * @param {Number} stride The vertex data stride
 */
SystemTerrain.HeightMap.prototype.calculateNormals = function(
    vertices,
    vertexOffset,
    normalOffset,
    stride) {
    for (let y = 0; y < this.yValues; ++y) for (let x = 0; x < this.xValues; ++x) {
        const index = (x + y * this.xValues) * stride;
        const normal = new Vector();
        let top = null;
        let bottom = null;

        if (y !== 0)
            top = new Vector(
                0,
                vertices[index + vertexOffset + 1 - this.xValues * stride] - vertices[index + vertexOffset + 1],
                -this.resolution);

        if (y !== this.yValues - 1)
            bottom = new Vector(
                0,
                vertices[index + vertexOffset + 1 + this.xValues * stride] - vertices[index + vertexOffset + 1],
                this.resolution);

        if (x !== 0) {
            const left = new Vector(
                -this.resolution,
                vertices[index - stride + vertexOffset + 1] - vertices[index + vertexOffset + 1],
                0);

            if (bottom)
                normal.add(bottom.copy().cross(left));

            if (top)
                normal.add(left.cross(top));
        }


        if (x !== this.xValues - 1) {
            const right = new Vector(
                this.resolution,
                vertices[index + stride + vertexOffset + 1] - vertices[index + vertexOffset + 1],
                0);

            if (top)
                normal.add(top.cross(right));

            if (bottom)
                normal.add(right.cross(bottom));
        }

        normal.normalize();

        vertices[index + normalOffset] = normal.x;
        vertices[index + normalOffset + 1] = normal.y;
        vertices[index + normalOffset + 2] = normal.z;
    }
};

/**
 * Build the height map data & upload it to the buffers
 */
SystemTerrain.HeightMap.prototype.build = function() {
    const vertices = new Array(this.values.length * 6);
    const indices = [];

    for (let y = 0; y < this.yValues; ++y) for (let x = 0; x < this.xValues; ++x) {
        const index = (x + y * this.xValues) * 6;

        vertices[index] = x * this.resolution;
        vertices[index + 1] = this.values[x + y * this.xValues];
        vertices[index + 2] = y * this.resolution;

        if (x !== this.xValues - 1 && y !== this.yValues - 1) {
            if ((x + (y & 1)) & 1)
                indices.push(
                    x + (y + 1) * this.xValues,
                    x + y * this.xValues,
                    x + y * this.xValues + 1,
                    x + y * this.xValues + 1,
                    x + (y + 1) * this.xValues + 1,
                    x + (y + 1) * this.xValues);
            else
                indices.push(
                    x + y * this.xValues,
                    x + y * this.xValues + 1,
                    x + (y + 1) * this.xValues + 1,
                    x + (y + 1) * this.xValues + 1,
                    x + (y + 1) * this.xValues,
                    x + y * this.xValues);
        }
    }

    this.calculateNormals(vertices, 0, 3, 6);

    this.indexCount = indices.length;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertices);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
};

/**
 * Draw this height map
 * @param {Shader} shader The active shader
 */
SystemTerrain.HeightMap.prototype.draw = function(shader) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertices);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices);

    this.gl.enableVertexAttribArray(shader.aVertex);
    this.gl.vertexAttribPointer(shader.aVertex, 3, this.gl.FLOAT, false, 24, 0);
    this.gl.enableVertexAttribArray(shader.aNormal);
    this.gl.vertexAttribPointer(shader.aNormal, 3, this.gl.FLOAT, false, 24, 12);

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
/**
 * A distance field for ocean wave sampling
 * @param {WebGLRenderingContext} gl The WebGL 1 rendering context
 * @param {Number} xValues The number of X values
 * @param {Number} yValues The number of Y values
 * @param {Array} values An array containing all height values
 * @param {Number} waterHeight The water height
 * @constructor
 */
SystemOcean.DistanceField = function(
    gl,
    xValues,
    yValues,
    values,
    waterHeight) {
    this.gl = gl;
    this.width = this.RESOLUTION * (xValues - 1);
    this.height = this.RESOLUTION * (yValues - 1);
    this.values = values;
    this.waterHeight = waterHeight;
    this.texture = this.gl.createTexture();
    this.framebuffer = this.gl.createFramebuffer();

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
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
        new Uint8Array(this.width * this.height << 2));
};

SystemOcean.DistanceField.prototype.RESOLUTION = 8;

/**
 * Free this distance field
 */
SystemOcean.DistanceField.prototype.free = function() {
    this.gl.deleteFramebuffer(this.framebuffer);
    this.gl.deleteTexture(this.texture);
};
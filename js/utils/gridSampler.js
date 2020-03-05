/**
 * A grid sampler which cna be used to sample interpolated grid values
 * @param {Number} width The grid width
 * @param {Number} height The grid height
 * @param {Array} values An array of values
 * @param {Number} [scale] The scale of the coordinates when sampling
 * @param {Number} [defaultValue] The default value outside of the grid
 * @constructor
 */
const GridSampler = function(
    width,
    height,
    values,
    scale = 1,
    defaultValue = 0) {
    this.width = width;
    this.height = height;
    this.values = values;
    this.scale = scale;
    this.defaultValue = defaultValue;
};

/**
 * Sample the grid
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @returns {Number} The interpolated grid value
 */
GridSampler.prototype.sample = function(x, y) {
    if (x < 0 || y < 0)
        return this.defaultValue;

    x *= this.scale;
    y *= this.scale;

    const xi = Math.floor(x);
    const yi = Math.floor(y);

    if (xi >= this.width - 1 || yi >= this.height - 1)
        return this.defaultValue;

    const fx = x - xi;
    const fy = y - yi;
    const ylu = this.values[xi + yi * this.width];
    const yld = this.values[xi + (yi + 1) * this.width];
    const yru = this.values[xi + 1 + yi * this.width];
    const yrd = this.values[xi + 1 + (yi + 1) * this.width];
    const yl = ylu + (yld - ylu) * fy;
    const yr = yru + (yrd - yru) * fy;

    return yl + (yr - yl) * fx;
};

/**
 * Change the values at a certain point
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @param {Number} delta The amount of change
 */
GridSampler.prototype.change = function(x, y, delta) {
    if (x < 0 || y < 0)
        return;

    x *= this.scale;
    y *= this.scale;

    const xi = Math.floor(x);
    const yi = Math.floor(y);

    if (xi >= this.width - 1 || yi >= this.height - 1)
        return;

    const fx = x - xi;
    const fy = y - yi;

    this.values[xi + yi * this.width] += fx * fy * delta;
    this.values[xi + 1 + yi * this.width] += (1 - fx) * fy * delta;
    this.values[xi + (yi + 1) * this.width] += fx * (1 - fy) * delta;
    this.values[xi + 1 + (yi + 1) * this.width] += (1 - fx) * (1 - fy) * delta;
};

/**
 * Apply gaussian blur to the values
 */
GridSampler.prototype.blur = function() {
    const newValues = new Array((this.width - 2) * (this.height - 2));

    for (let y = 1; y < this.height - 1; ++y) for (let x = 1; x < this.width - 1; ++x) {
        newValues[x - 1 + (y - 1) * (this.width - 2)] =
            (
                this.values[x - 1 + y * this.width] +
                this.values[x + (y - 1) * this.width] +
                this.values[x + 1 + y * this.width] +
                this.values[x + (y + 1) * this.width]
            ) * .125 +
            (
                this.values[x - 1 + (y -1) * this.width] +
                this.values[x + 1 + (y - 1) * this.width] +
                this.values[x + 1 + (y + 1) * this.width] +
                this.values[x - 1 + (y + 1) * this.width]
            ) * .0625 +
            this.values[x + y * this.width] * .25;
    }

    for (let y = 1; y < this.width - 1; ++y) for (let x = 1; x < this.height - 1; ++x)
        this.values[x + y * this.width] = newValues[x - 1 + (y - 1) * (this.width - 2)];
};
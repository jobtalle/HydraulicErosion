/**
 * A cone shaped height map mask
 * @param {Number} width The height map width
 * @param {Number} height The height map height
 * @param {Number} power A power to apply to the peak distance
 * @constructor
 */
const ShapeCone = function(width, height, power) {
    this.width = width;
    this.height = height;
    this.power = power;
};

/**
 * Sample the shape
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @returns {Number} A number in the range [0, 1]
 */
ShapeCone.prototype.sample = function(x, y) {
    const dx = (this.width * .5 - x) / this.width;
    const dy = (this.height * .5 - y) / this.height;

    return Math.cos(Math.PI * Math.min(1, 2 * Math.sqrt(dx * dx + dy * dy)) ** this.power) * .5 + .5;
};
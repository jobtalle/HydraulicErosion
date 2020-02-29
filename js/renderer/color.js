/**
 * A color
 * @param {Number} r The red value in the range [0, 1]
 * @param {Number} g The green value in the range [0, 1]
 * @param {Number} b The blue value in the range [0, 1]
 * @param {Number} [a] The alpha value in the range [0, 1]
 * @constructor
 */
const Color = function(r, g, b, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};
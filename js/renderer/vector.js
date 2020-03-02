/**
 * A 3D vector
 * @param {Number} [x] The X value
 * @param {Number} [y] The Y value
 * @param {Number} [z] The Z value
 * @constructor
 */
const Vector = function(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
};

Vector.UP = new Vector(0, 1, 0);

/**
 * Copy this vector
 * @returns {Vector} A copy of the vector
 */
Vector.prototype.copy = function() {
    return new Vector(this.x, this.y, this.z);
};

/**
 * Set this vectors contents equal to those of another vector
 * @param {Vector} other A vector
 * @returns {Vector} The modified vector
 */
Vector.prototype.set = function(other) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;

    return this;
};

/**
 * Negate this vector
 * @returns {Vector} The modified vector
 */
Vector.prototype.negate = function() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;

    return this;
};

/**
 * Add a vector to this vector
 * @param {Vector} other A vector
 * @returns {Vector} The modified vector
 */
Vector.prototype.add = function(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;

    return this;
};

/**
 * Subtract a vector from this vector
 * @param {Vector} other A vector
 * @returns {Vector} The modified vector
 */
Vector.prototype.subtract = function(other) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;

    return this;
};

/**
 * Multiply this vector by a scalar
 * @param {Number} scalar A number
 * @returns {Vector} The modified vector
 */
Vector.prototype.multiply = function(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;

    return this;
};

/**
 * Divide this vector by a scalar
 * @param {Number} scalar A number
 * @returns {Vector} The modified vector
 */
Vector.prototype.divide = function(scalar) {
    return this.multiply(1 / scalar);
};

/**
 * Get the dot product of this vector and another vector
 * @param {Vector} other A vector
 * @returns {Number} The dot product
 */
Vector.prototype.dot = function(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
};

/**
 * Calculate the length of this vector
 * @returns {Number} The length of this vector
 */
Vector.prototype.length = function() {
    return Math.sqrt(this.dot(this));
};

/**
 * Normalize this vector
 * @returns {Vector} The modified vector
 */
Vector.prototype.normalize = function() {
    return this.divide(this.length());
};

/**
 * Get the cross product of this vector and another vector
 * @param {Vector} other A vector
 * @returns {Vector} The cross product of this vector and the other vector
 */
Vector.prototype.cross = function(other) {
    return new Vector(
        this.y * other.z - other.y * this.z,
        this.z * other.x - other.z * this.x,
        this.x * other.y - other.x * this.y);
};

/**
 * Write the contents of this vector to an array
 * @param {Array} array The array to write this vectors values to
 */
Vector.prototype.toArray = function(array) {
    array[0] = this.x;
    array[1] = this.y;
    array[2] = this.z;
};
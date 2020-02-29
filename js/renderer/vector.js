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

Vector.prototype.copy = function() {
    return new Vector(this.x, this.y, this.z);
};

Vector.prototype.set = function(other) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;

    return this;
};

Vector.prototype.negate = function() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;

    return this;
};

Vector.prototype.add = function(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;

    return this;
};

Vector.prototype.subtract = function(other) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;

    return this;
};

Vector.prototype.multiply = function(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;

    return this;
};

Vector.prototype.divide = function(scalar) {
    return this.multiply(1 / scalar);
};

Vector.prototype.dot = function(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
};

Vector.prototype.length = function() {
    return Math.sqrt(this.dot(this));
};

Vector.prototype.normalize = function() {
    return this.divide(this.length());
};

Vector.prototype.cross = function(other) {
    return new Vector(
        this.y * other.z - other.y * this.z,
        this.z * other.x - other.z * this.x,
        this.x * other.y - other.x * this.y);
};

Vector.prototype.toArray = function(array) {
    array[0] = this.x;
    array[1] = this.y;
    array[2] = this.z;
};
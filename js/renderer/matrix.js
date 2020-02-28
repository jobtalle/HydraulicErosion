/**
 * Construct a 4x4 matrix.
 * The values can be given in row-major order.
 * If no values are given, the matrix will be the identity matrix.
 * @constructor
 */
const Matrix = function(_00, _10, _20, _30, _01, _11, _21, _31, _02, _12, _22, _32, _03, _13, _23, _33) {
    if (!_00)
        this.identity();
    else {
        this._00 = _00;
        this._10 = _10;
        this._20 = _20;
        this._30 = _30;
        this._01 = _01;
        this._11 = _11;
        this._21 = _21;
        this._31 = _31;
        this._02 = _02;
        this._12 = _12;
        this._22 = _22;
        this._32 = _32;
        this._03 = _03;
        this._13 = _13;
        this._23 = _23;
        this._33 = _33;
    }
};

/**
 * Set the values in this matrix to the values of another matrix.
 * @param {Matrix} other Another matrix.
 */
Matrix.prototype.set = function(other) {
    this._00 = other._00;
    this._10 = other._10;
    this._20 = other._20;
    this._30 = other._30;
    this._01 = other._01;
    this._11 = other._11;
    this._21 = other._21;
    this._31 = other._31;
    this._02 = other._02;
    this._12 = other._12;
    this._22 = other._22;
    this._32 = other._32;
    this._03 = other._03;
    this._13 = other._13;
    this._23 = other._23;
    this._33 = other._33;
};

/**
 * Make a copy of this matrix.
 * @returns {Matrix} A copy of the matrix.
 */
Matrix.prototype.copy = function() {
    return new Matrix(
        this._00, this._10, this._20, this._30,
        this._01, this._11, this._21, this._31,
        this._02, this._12, this._22, this._32,
        this._03, this._13, this._23, this._33);
};

/**
 * Set the matrix to the identity matrix.
 * @returns {Matrix} The matrix after the operation.
 */
Matrix.prototype.identity = function() {
    this._00 = this._11 = this._22 = this._33 = 1;
    this._10 = this._20 = this._30 =
        this._01 = this._21 = this._31 =
            this._02 = this._12 = this._32 =
                this._03 = this._13 = this._23 = 0;

    return this;
};

/**
 * Multiply this matrix by another matrix.
 * @param {Matrix} other The other matrix.
 * @returns {Matrix} The matrix after the operation.
 */
Matrix.prototype.multiply = function(other) {
    const _00 = this._00;
    const _10 = this._10;
    const _20 = this._20;
    const _30 = this._30;
    const _01 = this._01;
    const _11 = this._11;
    const _21 = this._21;
    const _31 = this._31;
    const _02 = this._02;
    const _12 = this._12;
    const _22 = this._22;
    const _32 = this._32;
    const _03 = this._03;
    const _13 = this._13;
    const _23 = this._23;
    const _33 = this._33;

    this._00 = _00 * other._00 + _10 * other._01 + _20 * other._02 + _30 * other._03;
    this._10 = _00 * other._10 + _10 * other._11 + _20 * other._12 + _30 * other._13;
    this._20 = _00 * other._20 + _10 * other._21 + _20 * other._22 + _30 * other._23;
    this._30 = _00 * other._30 + _10 * other._31 + _20 * other._32 + _30 * other._33;
    this._01 = _01 * other._00 + _11 * other._01 + _21 * other._02 + _31 * other._03;
    this._11 = _01 * other._10 + _11 * other._11 + _21 * other._12 + _31 * other._13;
    this._21 = _01 * other._20 + _11 * other._21 + _21 * other._22 + _31 * other._23;
    this._31 = _01 * other._30 + _11 * other._31 + _21 * other._32 + _31 * other._33;
    this._02 = _02 * other._00 + _12 * other._01 + _22 * other._02 + _32 * other._03;
    this._12 = _02 * other._10 + _12 * other._11 + _22 * other._12 + _32 * other._13;
    this._22 = _02 * other._20 + _12 * other._21 + _22 * other._22 + _32 * other._23;
    this._32 = _02 * other._30 + _12 * other._31 + _22 * other._32 + _32 * other._33;
    this._03 = _03 * other._00 + _13 * other._01 + _23 * other._02 + _33 * other._03;
    this._13 = _03 * other._10 + _13 * other._11 + _23 * other._12 + _33 * other._13;
    this._23 = _03 * other._20 + _13 * other._21 + _23 * other._22 + _33 * other._23;
    this._33 = _03 * other._30 + _13 * other._31 + _23 * other._32 + _33 * other._33;

    return this;
};

/**
 * Set this matrix to be a "look at" matrix for camera positioning.
 * @param {Object} from The camera position.
 * @param {Object} to The target position.
 * @param {Object} up A normalized vector defining the up direction for the camera.
 * @returns {Matrix} The matrix after the operation.
 */
Matrix.prototype.lookAt = function(from, to, up) {
    this._02 = from.x - to.x;
    this._12 = from.y - to.y;
    this._22 = from.z - to.z;

    const zli = 1 / Math.sqrt(this._02 * this._02 + this._12 * this._12 + this._22 * this._22);

    this._02 *= zli;
    this._12 *= zli;
    this._22 *= zli;
    this._32 = -this._02 * from.x - this._12 * from.y - this._22 * from.z;

    this._00 = this._12 * up.z - up.y * this._22;
    this._10 = this._22 * up.x - up.z * this._02;
    this._20 = this._02 * up.y - up.x * this._12;

    const xli = 1 / Math.sqrt(this._00 * this._00 + this._10 * this._10 + this._20 * this._20);

    this._00 *= xli;
    this._10 *= xli;
    this._20 *= xli;
    this._30 = -this._00 * from.x - this._10 * from.y - this._20 * from.z;

    this._01 = this._10 * this._22 - this._12 * this._20;
    this._11 = this._20 * this._02 - this._22 * this._00;
    this._21 = this._00 * this._12 - this._02 * this._10;
    this._31 = -this._01 * from.x - this._11 * from.y - this._21 * from.z;

    this._03 = 0;
    this._13 = 0;
    this._23 = 0;
    this._33 = 1;

    return this;
};

/**
 * Set this matrix to a perspective projection.
 * @param {Number} angle The vertical camera angle in radians.
 * @param {Number} aspect The aspect ratio of the viewport.
 * @param {Number} zNear The near clipping plane.
 * @param {Number} zFar The far clipping plane.
 * @returns {Matrix} The matrix after the operation.
 */
Matrix.prototype.perspective = function(angle, aspect, zNear, zFar) {
    const a = 1 / Math.tan(angle * 0.5);
    const r = 1 / (zNear - zFar);

    this._00 = a / aspect;
    this._10 = this._20 = this._30 = 0;
    this._11 = a;
    this._01 = this._21 = this._31 = 0;
    this._02 = this._12 = 0;
    this._22 = (zNear + zFar) * r;
    this._32 = zNear * zFar * r * 2;
    this._03 = this._13 = this._33 = 0;
    this._23 = -1;

    return this;
};

/**
 * Write the values of this matrix to an array in column-major order.
 * @param {Array} target The array.
 */
Matrix.prototype.toArray = function(target) {
    target[0] = this._00;
    target[1] = this._01;
    target[2] = this._02;
    target[3] = this._03;
    target[4] = this._10;
    target[5] = this._11;
    target[6] = this._12;
    target[7] = this._13;
    target[8] = this._20;
    target[9] = this._21;
    target[10] = this._22;
    target[11] = this._23;
    target[12] = this._30;
    target[13] = this._31;
    target[14] = this._32;
    target[15] = this._33;
};

Matrix.makeTranslate = function(delta) {
    return new Matrix(
        1, 0, 0, delta.x,
        0, 1, 0, delta.y,
        0, 0, 1, delta.z,
        0, 0, 0, 1);
};

Matrix.makeRotateX = function(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Matrix(
        1, 0, 0, 0,
        0, c, -s, 0,
        0, s, c, 0,
        0, 0, 0, 1);
};

Matrix.makeRotateY = function(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Matrix(
        c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1);
};

Matrix.makeRotateZ = function(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Matrix(
        c, -s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1);
};
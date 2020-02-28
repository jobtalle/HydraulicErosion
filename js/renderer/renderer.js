const Renderer = function(canvas) {
    this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    this.systemGeometry = new SystemGeometry(this.gl);
    this.matrixBuffer = new Array(16);
    this.matrixProjection = new Matrix();
    this.matrixModelView = new Matrix();
    this.matrixMVP = new Matrix();

    this.resize(canvas.width, canvas.height);
    this.setup();
};

Renderer.prototype.ZNEAR = .1;
Renderer.prototype.ZFAR = 100;
Renderer.prototype.ANGLE = Math.PI * .35;
Renderer.prototype.UP = new Vector(0, 1, 0);

Renderer.prototype.updateMatrices = function() {
    this.matrixMVP.set(this.matrixProjection);
    this.matrixMVP.multiply(this.matrixModelView);
    this.matrixMVP.toArray(this.matrixBuffer);
};

Renderer.prototype.draw = function() {
    this.gl.viewport(0, 0, this.width, this.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.systemGeometry.draw(this.matrixBuffer);
};

Renderer.prototype.setup = function() {
    this.gl.clearColor(.3, .3, .35, 1);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
};

Renderer.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;
    this.matrixProjection.perspective(this.ANGLE, width / height, this.ZNEAR, this.ZFAR);
};

Renderer.prototype.view = function(from, to) {
    this.matrixModelView.lookAt(from, to, this.UP);
    this.updateMatrices();
};
const Renderer = function(canvas) {
    this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    this.width = canvas.width;
    this.height = canvas.height;
    this.gl.clearColor(.3, .3, .3, 1);
};

Renderer.prototype.draw = function() {
    this.gl.viewport(0, 0, this.width, this.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
};

Renderer.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;
};
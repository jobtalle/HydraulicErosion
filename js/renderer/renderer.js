const Renderer = function(canvas) {
    this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    this.width = canvas.width;
    this.height = canvas.height;
};

Renderer.prototype.draw = function() {

};

Renderer.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;
};
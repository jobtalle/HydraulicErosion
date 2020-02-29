SystemTerrain.HeightMap = function(container, gl, width, height, values) {
    this.container = container;
    this.gl = gl;
};

SystemTerrain.HeightMap.prototype.draw = function() {

};

SystemTerrain.HeightMap.prototype.free = function() {
    this.container.splice(this.container.indexOf(this), 1);
};
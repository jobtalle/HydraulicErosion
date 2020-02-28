SystemGeometry.Mesh = function(container, gl, vertices, indices) {
    this.container = container;
    this.gl = gl;
    this.vertices = gl.createBuffer();
    this.indices = gl.createBuffer();

    this.upload(vertices, indices);
};

SystemGeometry.Mesh.prototype.upload = function(vertices, indices) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertices);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
};

SystemGeometry.Mesh.prototype.draw = function() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertices);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices);
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
};

SystemGeometry.Mesh.prototype.free = function() {
    this.gl.deleteBuffer(this.vertices);
    this.gl.deleteBuffer(this.indices);
    this.container.splice(this.container.indexOf(this), 1);
};
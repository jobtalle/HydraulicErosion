const Bounty = function(renderer) {
    this.renderer = renderer;
    this.angle = 0;

    this.renderer.view(
        new Vector(0, 5, -10),
        new Vector());

    this.heightmap = renderer.systemGeometry.makeMesh(
        [
            -10, 0, -10,
            -10, 0, 10,
            10, 0, 10,
            10, 0, -10
        ],
        [0, 3, 2, 2, 1, 0]);
};

Bounty.prototype.update = function(timeStep) {
    this.angle += timeStep * .2;

    const r = 25;

    this.renderer.view(
        new Vector(
            Math.cos(this.angle) * r,
            .5 * r,
            Math.sin(this.angle) * r
        ),
        new Vector());
};

Bounty.prototype.free = function() {
    this.heightmap.free();
};
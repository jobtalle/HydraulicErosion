const Bounty = function(renderer) {
    this.renderer = renderer;
    this.angle = 0;
    this.terrain = null;
    this.genQueue = [
        () => this.terrain = new Terrain()
    ];

    this.heightmap = renderer.systemGeometry.makeMesh(
        [
            -10, 0, -10,
            -10, 0, 10,
            10, 0, 10,
            10, 0, -10
        ],
        [0, 3, 2, 2, 1, 0]);
};

Bounty.prototype.GEN_TIME_MAX = 1 / 60;

Bounty.prototype.generate = function(time) {
    const startTime = new Date();

    while (this.genQueue.length !== 0 && (new Date() - startTime) * .001 < time)
        this.genQueue.shift()();
};

Bounty.prototype.update = function(timeStep) {
    if (this.genQueue.length !== 0) {
        this.generate(Bounty.prototype.GEN_TIME_MAX);

        return;
    }

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
    if (this.terrain)
        this.terrain.free();

    this.heightmap.free();
};
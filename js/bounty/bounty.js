/**
 * An island scene
 * @param {BountyParameters} parameters The parameters that govern how the scene is generated
 * @param {Renderer} renderer The renderer
 * @constructor
 */
const Bounty = function(parameters, renderer) {
    this.renderer = renderer;
    this.angle = 0;
    this.terrain = null;
    this.genQueue = [
        () => this.terrain = new Terrain(parameters.terrainParameters),
        () => this.terrain.createModel(renderer)
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

/**
 * Execute the functions in the generation queue
 * @param {Number} time The maximum amount of time that may be used in seconds
 */
Bounty.prototype.generate = function(time) {
    const startTime = new Date();

    while (this.genQueue.length !== 0 && (new Date() - startTime) * .001 < time)
        this.genQueue.shift()();
};

/**
 * Update the scene, or generate it if it is not ready
 * @param {Number} timeStep The amount of elapsed time since the previous update in seconds
 */
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

/**
 * Free the scene
 */
Bounty.prototype.free = function() {
    if (this.terrain)
        this.terrain.free();

    this.heightmap.free();
};
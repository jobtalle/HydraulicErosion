/**
 * An island scene
 * @param {BountyParameters} parameters The parameters that govern how the scene is generated
 * @param {Renderer} renderer The renderer
 * @constructor
 */
const Bounty = function(parameters, renderer) {
    this.random = new Random(parameters.seed);
    this.parameters = parameters;
    this.renderer = renderer;
    this.angle = 0;
    this.terrain = null;
    this.genQueue = [
        () => this.terrain = new Terrain(parameters.terrainParameters, this.random),
        () => this.terrain.createHeightMap(),
        () => this.terrain.createModel(renderer)
    ];
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

    const r = 20;
    const cx = this.parameters.terrainParameters.width * .5;
    const cy = this.parameters.terrainParameters.height * .5;

    this.renderer.view(
        new Vector(
            cx + Math.cos(this.angle) * r,
            .5 * r,
            cy + Math.sin(this.angle) * r
        ),
        new Vector(cx, 0, cy));
};

/**
 * Free the scene
 */
Bounty.prototype.free = function() {
    if (this.terrain)
        this.terrain.free();
};
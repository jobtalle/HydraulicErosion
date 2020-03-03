/**
 * An island scene
 * @param {IslandParameters} parameters The parameters that govern how the scene is generated
 * @param {Renderer} renderer The renderer
 * @constructor
 */
const Island = function(parameters, renderer) {
    this.random = new Random(parameters.seed);
    this.parameters = parameters;
    this.renderer = renderer;
    this.terrain = null;
    this.genQueue = [
        () => this.terrain = new Terrain(parameters.terrainParameters, this.random),
        () => this.terrain.createHeightMap(),
        () => this.terrain.createVolcanoes(),
        () => this.terrain.erode(),
        () => this.terrain.createModel(renderer)
    ];
};

Island.prototype.GEN_TIME_MAX = 1 / 60;

/**
 * Execute the functions in the generation queue
 * @param {Number} time The maximum amount of time that may be used in seconds
 */
Island.prototype.generate = function(time) {
    const startTime = new Date();

    while (this.genQueue.length !== 0 && (new Date() - startTime) * .001 < time)
        this.genQueue.shift()();
};

/**
 * Update the scene, or generate it if it is not ready
 * @param {Number} timeStep The amount of elapsed time since the previous update in seconds
 */
Island.prototype.update = function(timeStep) {
    if (this.genQueue.length !== 0)
        this.generate(Island.prototype.GEN_TIME_MAX);
};

/**
 * Free the scene
 */
Island.prototype.free = function() {
    if (this.terrain)
        this.terrain.free();
};
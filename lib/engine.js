var Engine = module.exports = function() {
    this.definitions = {};
};

Engine.prototype.registerDefinition = function(path, definition) {
    this.definitions[path] = definition;
};

Engine.prototype.hasDefinition = function(path) {
    return this.definitions[path];
};

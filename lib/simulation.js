function Engine() {
    this.definitions = {};
}

Engine.prototype.registerDefinition = function(path, definition) {
    this.definitions[path] = definition;
};

Engine.prototype.hasDefinition = function(path) {
    return this.definitions[path];
};

var engine = new Engine();

require('./legislation/rsa')(engine);
require('./legislation/al')(engine);
require('./models/person')(engine);

engine.registerDefinition('simulation', {
    required: ['al.éligibilité', 'rsa.conditionÂge'],
    getValue: function(al, rsa) {
        return { al: al, rsa: rsa };
    }
});

module.exports = engine;

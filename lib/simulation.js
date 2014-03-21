var Engine = require('./engine');
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

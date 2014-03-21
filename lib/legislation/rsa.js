var _ = require('lodash');

module.exports = function(engine) {

    engine.registerDefinition('rsa.conditionÂge', {
        required: ['demandeur.âge'],
        optional: ['demandeur.parentIsolé'],
        getValue: function(âge, parentIsolé) {
            if (âge >= 25) return true;
            else if (_.isUndefined(parentIsolé)) return this.claim('demandeur.parentIsolé');
            else if (parentIsolé) return true;
            else return false;
        }
    });

};

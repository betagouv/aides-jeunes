var fs = require('fs');
var _ = require('lodash');

var openfisca = require('./openfisca');

var definitions = {};

// Walk through definitions
var definitionsPath = __dirname + '/definitions';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                _.extend(definitions, require(newPath));
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(definitionsPath);

definitions.simulation = {
    required: ['al.éligibilité', 'rsa.conditionÂge', 'demandeur.situationFamiliale', 'demandeur.mineur', 'demandeur.salaire3DerniersMois', 'demandeur.situationPro'],
    getValue: function(al, rsa) {
        if (al || rsa) return openfisca.simulate(this.toJSON());
        return { ASPA: 0, ALS: 0, APL: 0, RSA: 0 };
    }
};

module.exports = definitions;

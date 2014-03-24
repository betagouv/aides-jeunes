var fs = require('fs');
var _ = require('lodash');

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
    required: ['al.éligibilité', 'rsa.conditionÂge'],
    getValue: function(al, rsa) {
        return this.respond({ al: al, rsa: rsa });
    }
};

module.exports = definitions;

var droits = require('../../../app/js/constants/droits');

// Mitigate label duplicates by counting them and appending provider label when necessary
var labelCount = {};
Object.keys(droits).forEach(function(prestationLevel) {
    var providers = droits[prestationLevel];
    Object.keys(providers).forEach(function(providerName) {
        var provider = providers[providerName];
        Object.keys(provider.prestations).forEach(function(prestationName) {
            var prestation = provider.prestations[prestationName];
            labelCount[prestation.label] = (labelCount[prestation.label] || 0 ) + 1;
        });
    });
});

var possibleValues = [];
Object.keys(droits).forEach(function(prestationLevel) {
    var providers = droits[prestationLevel];

    Object.keys(providers).forEach(function(providerName) {
        var provider = providers[providerName];

        var options = Object.keys(provider.prestations).map(function(prestationName) {
            var prestation = provider.prestations[prestationName];
            var label = (labelCount[prestation.label] == 1) ? prestation.label : (prestation.label + ' - ' + provider.label);
            var value = {
                id: prestationName,
                shortLabel: label,
                hasMontant: (! prestation.type) || prestation.type == 'float',
            };

            if (prestation.unit) {
                value.unit = prestation.unit;
            }

            if (prestation.uncomputability) {
                value.uncomputabilityReasons = Object.keys(prestation.uncomputability).reduce(function(reasons, reasonName) {
                    reasons[reasonName] = prestation.uncomputability[reasonName].admin;
                    return reasons;
                }, {});
            }

            return value;
        });

        options.forEach(function(option) { possibleValues.push(option); });
    });
});

module.exports = possibleValues;

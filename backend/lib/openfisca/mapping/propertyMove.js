var _ = require('lodash');
var common = require('./common');

var famillePropertiesGivenToIndividu = Object
    .keys(_.pickBy(common.requestedVariables, function(definition) {
        return ((! definition.type) || (definition.type == 'float')) &&
            (definition.entity == 'familles');
    }))
    .concat(['aeeh', 'paje_prepare', 'paje_clca']);

var movedProperties = {
    familles: {
        properties: famillePropertiesGivenToIndividu
            .map(function(id) { return { name: id }; }),
        sourceKeys: ['parents', 'enfants'],
    },
    foyers_fiscaux: {
        properties: [{ name: 'pensions_alimentaires_versees', sign: -1 }],
        sourceKeys: ['declarants', 'personnes_a_charge'],
    },
};

exports.movePropertyValuesToGroupEntity = function(testCase) {
    Object.keys(movedProperties).forEach(function(testCasePropertyName) {
        var moveDetails = movedProperties[testCasePropertyName];

        _.forEach(testCase[testCasePropertyName], function(entity) {
            var entityIndividuIds = moveDetails.sourceKeys.reduce(function(accum, key) {
                return accum.concat(entity[key] || []);
            }, []);

            moveDetails.properties.forEach(function(property) {
                var sign = property.sign || 1;
                var accum = entityIndividuIds.reduce(function(accum, id) {
                    var individu = testCase.individus[id];
                    var individuRessource = individu[property.name];
                    for (var period in individu[property.name]) {
                        if (! accum[period])
                            accum[period] = 0;
                        accum[period] = accum[period] + sign * individuRessource[period];
                    }
                    delete individu[property.name];
                    return accum;
                }, {});

                // Conditionnally added to match logic of applyRessources
                if (Object.keys(accum).length) {
                    entity[property.name] = accum;
                }
            });
        });
    });

    return testCase;
};

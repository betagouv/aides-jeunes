var _ = require('lodash');
var common = require('./common');

var famillePropertiesGivenToIndividu = Object
    .keys(_.pickBy(common.requestedVariables, function(definition) {
        return ((! definition.type) || (definition.type == 'float')) &&
            ((! definition.entity) || (definition.entity == 'famille'));
    }))
    .concat(['aeeh', 'paje_prepare', 'paje_clca']);

var movedProperties = {
    Famille: {
        properties: famillePropertiesGivenToIndividu
            .map(function(id) { return { name: id }; }),
        sourceKeys: ['parents', 'enfants'],
        testCasePropertyName: 'familles',
    },
    Foyer_Fiscal: {
        properties: [{ name: 'pensions_alimentaires_versees', sign: -1 }],
        sourceKeys: ['declarants', 'personnes_a_charge'],
        testCasePropertyName: 'foyers_fiscaux',
    },
};

exports.movePropertiesToIndividuEntity = function(definitions) {
    var individuProps = definitions.Individu.properties;

    Object.keys(movedProperties).forEach(function(sourceEntityName) {
        var sourceProps = definitions[sourceEntityName].properties;
        var moveDetails = movedProperties[sourceEntityName];
        var ressourceNames = moveDetails.properties.map(function(ressource) { return ressource.name; });

        ressourceNames.forEach(function(ressourceName) {
            individuProps[ressourceName] = sourceProps[ressourceName];
        });
    });
};

exports.movePropertyValuesToGroupEntity = function(testCase) {
    var individus = {};

    testCase.individus.forEach(function(individu) {
        individus[individu.id] = individu;
    });

    Object.keys(movedProperties).forEach(function(sourceEntityName) {
        var moveDetails = movedProperties[sourceEntityName];

        testCase[moveDetails.testCasePropertyName].forEach(function(entity) {
            var entityIndividuIds = [];
            moveDetails.sourceKeys.forEach(function(roleEntity) {
                entity[roleEntity].forEach(function(individuId) {
                    entityIndividuIds.push(individuId);
                });
            });

            moveDetails.properties.forEach(function(property) {
                var sign = property.sign || 1;
                var accum = entityIndividuIds.reduce(function(accum, id) {
                    var individu = individus[id];
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

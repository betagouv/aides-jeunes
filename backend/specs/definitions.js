var openfiscaSpec = require('./openfisca-api-spec');

var additionalDefinitions = {
    Situation: {
        additionalProperties: false,
        properties: {
            famille: {
                '$ref': '#/definitions/Famille',
                type: 'object',
            },
            foyer_fiscal: {
                '$ref': '#/definitions/Foyer_Fiscal',
                type: 'object',
            },
            individus: {
                items: {
                    '$ref': '#/definitions/Individu',
                },
                type: 'array',
            },
            menage: {
                '$ref': '#/definitions/Menage',
                type: 'object',
            },
            dateDeValeur: {
                type: 'Date',
            },
            modifiedFrom: {
                type: 'string',
            },
        },
        type: 'object',
    },
};

Object.assign(openfiscaSpec.definitions, additionalDefinitions);

openfiscaSpec.definitions.Individu.properties.firstName = { type: 'string' };
openfiscaSpec.definitions.Individu.properties.nationalite = { type: 'string' };
openfiscaSpec.definitions.Individu.properties.role = { type: 'string' };
openfiscaSpec.definitions.Individu.properties.specificSituations = {
    type: 'array',
    items: {
        type: 'string',
    }
};
openfiscaSpec.definitions.Individu.properties.tauxIncapacite = { type: 'string' };

openfiscaSpec.definitions.Menage.properties.code_postal = { type: 'string' };
openfiscaSpec.definitions.Menage.properties.nom_commune = { type: 'string' };

delete openfiscaSpec.definitions.Famille.properties.parents;
delete openfiscaSpec.definitions.Famille.properties.enfants;
delete openfiscaSpec.definitions.Foyer_Fiscal.properties.personnes_a_charge;
delete openfiscaSpec.definitions.Foyer_Fiscal.properties.declarants;
delete openfiscaSpec.definitions.Menage.properties.enfants;


var mapping = require('../lib/openfisca/mapping');
mapping.movePropertiesToIndividuEntity(openfiscaSpec.definitions);

module.exports = openfiscaSpec.definitions;

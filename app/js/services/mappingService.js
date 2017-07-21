'use strict';

angular.module('ddsApp').service('MappingService', function($http, droitsDescription, MappingPeriodService, SituationService, mappingSchemas, ressourceMapping) {
    function isNotValidValue(value) {
        return _.isNaN(value) || _.isUndefined(value) || value === null;
    }

    function generateRequestedVariables() {
        var structuredVariables = _.values(droitsDescription).map(function(level) {
            return _.values(level).map(function(provider) {
                return _.values(_.mapValues(provider.prestations, function(prestation, prestationName) {
                        var prestations = {};
                        prestations[prestationName] = _.assign({}, prestation);
                        if (prestation.uncomputability)
                            prestations[prestationName + '_non_calculable'] = _.assign({}, prestation, { type: 'string' });
                        return prestations;
                }));
            });
        });

        return _.chain(structuredVariables).flatten().flatten().value()
            .reduce(function(obj, accum) { return _.assign(accum, obj); } , {});
    }

    var requestedVariables = generateRequestedVariables();

    function applyRessources(ressourceInput, ressourceOutput, mappingSchema) {
        _.forEach(mappingSchema, function(sourceDefinitions, outputKey) {
            if (sourceDefinitions === outputKey)
                return;
            if (! _.isArray(sourceDefinitions)) {
                sourceDefinitions = [sourceDefinitions];
            }
            ressourceOutput[outputKey] = {};
            var result = ressourceOutput[outputKey];
            _.forEach(sourceDefinitions, function(definition) {
                var srcKey = definition.src || definition;
                var fn = definition.fn || function(x) { return x; };

                _.forEach(ressourceInput[srcKey], function(value, period) {
                    result[period] = result[period] | 0;
                    result[period] += fn(value);
                });
            });
        });
    }

    function buildOpenFiscaEntity(mesAidesEntity, mappingSchema, situation) {
        var result = _.cloneDeep(mesAidesEntity);
        _.forEach(mappingSchema, function(definition, openfiscaKey) {
            var params = _.isString(definition) ? { src: definition } : definition;

            if (params.values) {
                result[openfiscaKey] = params.values[mesAidesEntity[params.src]];
            } else if (params.fn) {
                result[openfiscaKey] = params.src ? params.fn(mesAidesEntity[params.src], mesAidesEntity, situation) : params.fn(mesAidesEntity, situation);
            } else {
                result[openfiscaKey] = mesAidesEntity[params.src];
            }

            if (params.round && _.isNumber(result[openfiscaKey])) {
                result[openfiscaKey] = Math.round(result[openfiscaKey]);
            }

            // Remove null as OpenFisca do not handle them correctly
            if (isNotValidValue(result[openfiscaKey])) {
                if ('default' in params) result[openfiscaKey] = params.default;
                else delete result[openfiscaKey];
            }
        });
        return result;
    }

    function duplicateRessourcesForAnneeFiscaleDeReference(individu, dateDeValeur) {
        var periods = MappingPeriodService.getPeriods(dateDeValeur);
        Object.keys(ressourceMapping.individu).forEach(function(ressourceName) {
            var result = individu[ressourceName];
            if (! result)
                return;
            // Variables can be defined on a yearly or a monthly basis
            if (result[periods.lastYear]) {
                result[periods.anneeFiscaleReference] = result[periods.lastYear];
            } else {
                var sumOverLast12Months = periods.last12Months.reduce(function(sum, periodObject) {
                    return sum + result[periodObject];
                }, 0);
                if (sumOverLast12Months) {
                    periods.anneeFiscaleReference12Months.forEach(function(month) {
                        result[month] = sumOverLast12Months / 12;
                    });
                }
            }
        });
    }

    function mapIndividus(situation) {
        var individus = _.filter(situation.individus, function(individu) {
            return mappingSchemas.isIndividuValid(individu, situation);
        });

        return _.map(individus, function(individu) {
            if (individu.role === 'demandeur' && situation.patrimoine) {
                // Mongoose embeded objects must be converted to objects
                _.extend(individu, situation.patrimoine.toObject ? situation.patrimoine.toObject() : situation.patrimoine);
            }
            var openfiscaIndividu = buildOpenFiscaEntity(individu, mappingSchemas.individu, situation);
            applyRessources(individu, openfiscaIndividu, ressourceMapping.individu);

            if (! SituationService.ressourcesYearMoins2Captured(situation)) {
                duplicateRessourcesForAnneeFiscaleDeReference(openfiscaIndividu, situation.dateDeValeur);
            }
            return openfiscaIndividu;
        });
    }

    function setNonInjectedPrestationsToZero(familles, individus, dateDeValeur) {
        var subjects = {
            // Hijack famille prestations are currently all attach to individus
            famille: individus,//familles,
            individu: individus,
        };

        var prestationsFinancieres = _.pickBy(requestedVariables, function(definition, key) {
            return (! definition.type) || definition.type === 'float';
        });

        _.forEach(prestationsFinancieres, function(definition, prestationName) {
            _.forEach(subjects[definition.entity || 'famille'], function(entity) {
                _.forEach(MappingPeriodService.getPeriods(dateDeValeur).last12Months, function(period) {
                    entity[prestationName] = entity[prestationName] || {};
                    entity[prestationName][period] = entity[prestationName][period] || 0;
                });
            });
        });
    }

    function buildOpenFiscaTestCase(situation) {
        var familles = [ situation.famille ],
            individus = mapIndividus(situation);

        setNonInjectedPrestationsToZero(familles, individus, situation.dateDeValeur);

        return {
            familles: familles,
            foyers_fiscaux: [ situation.foyer_fiscal ],
            individus: individus,
            menages: [ situation.menage ],
        };
    }

    function allocateIndividualsToEntities(situation) {
        var famille = situation.famille;
        var foyer = situation.foyer_fiscal;
        var menage = situation.menage;

        var demandeurId = SituationService.getDemandeur(situation).id;

        var conjoint = SituationService.getConjoint(situation);
        var conjointId = conjoint && conjoint.id;

        famille.parents = [ demandeurId ];
        foyer.declarants = [ demandeurId ];
        menage.personne_de_reference = demandeurId;
        if (conjointId) {
            famille.parents.push(conjointId);
            foyer.declarants.push(conjointId);
            menage.conjoint = conjointId;
        }

        var enfants = SituationService.getEnfants(situation);
        var validEnfants = _.filter(enfants, function(enfant) { return mappingSchemas.isIndividuValid(enfant, situation); });
        var enfantIds = validEnfants.map(function(enfant) { return enfant.id; });
        famille.enfants = enfantIds;
        foyer.personnes_a_charge = enfantIds;
        menage.enfants = enfantIds;
    }

    function copyTo3PreviousMonths(testCase, dateDeValeur) {
        var periodKeys = ['thisMonth', '1MonthsAgo', '2MonthsAgo', '3MonthsAgo'];
        var periods = MappingPeriodService.getPeriods(dateDeValeur);

        var forDuplication = mappingSchemas.forDuplication;
        Object.keys(forDuplication).forEach(function(entityName) {
            forDuplication[entityName].forEach(function(entityPropertyName) {
                testCase[entityName].forEach(function(entity) {
                    var value = entity[entityPropertyName];
                    var result = {};
                    periodKeys.forEach(function(periodKey) {
                        result[periods[periodKey]] = value;
                    });
                    entity[entityPropertyName] = result;
                });
            });
        });
    }

    function buildOpenFiscaRequest(sourceSituation) {
        var situation = _.cloneDeep(sourceSituation);
        allocateIndividualsToEntities(situation);
        if (situation.menage.loyer) {
            situation.menage.loyer = Math.round(situation.menage.loyer);
        }
        var testCase = buildOpenFiscaTestCase(situation);
        copyTo3PreviousMonths(testCase, situation.dateDeValeur);
        return {
            intermediate_variables: true,
            labels: true,
            scenarios: [{
                test_case: testCase,
                period: 'month:' + MappingPeriodService.toOpenFiscaFormat(situation.dateDeValeur),
            }],
            variables: _.keys(requestedVariables).sort(),
        };
    }

    function getStatutOccupationLogement(logement) {
        var statusOccupationMap = {
            'proprietaireprimoaccedant': 1,
            'proprietaire': 2,
            'locatairenonmeuble': 4,
            'locatairemeublehotel': 5,
            'heberge': 6,
            'locatairefoyer': 7,
            'sansDomicile' : 8
        };
        var statusOccupationId = logement.type;
        if (logement.type == 'proprietaire' && logement.primoAccedant) {
            statusOccupationId = 'proprietaireprimoaccedant';
        } else if (logement.type == 'locataire' && logement.locationType) {
            statusOccupationId += logement.locationType;
        }
        return statusOccupationMap[statusOccupationId];
    }

    function getBaseLogement(statusOccupationId) {
        var baseLogementMap = {
            1: { type: 'proprietaire', primoAccedant: true },
            2: { type: 'proprietaire' },
            4: { type: 'locataire', locationType: 'nonmeuble' },
            5: { type: 'locataire', locationType: 'meublehotel' },
            6: { type: 'heberge' },
            7: { type: 'locataire', locationType: 'foyer' },
            8: { type: 'sansDomicile' },
        };
        return (statusOccupationId && baseLogementMap[statusOccupationId]) || {};
    }

    function buildSituationFromDB(dbSimulation) {
        return dbSimulation;
    }

    return {
        buildSituationFromDB: buildSituationFromDB,
        buildOpenFiscaRequest: buildOpenFiscaRequest,
        statutOccupationLogement: {
            getBaseLogement: getBaseLogement,
            getValue: getStatutOccupationLogement,
        },
        // Exported for testing purposes
        _applyRessources: applyRessources,
        _mapIndividus: mapIndividus,
    };
});

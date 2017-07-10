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

    function applyRessources(mesAidesEntity, openfiscaEntity, mappingSchema, situation) {
        var dateDeValeur = situation.dateDeValeur;
        var periods = MappingPeriodService.getPeriods(dateDeValeur);
        var ressourcesByType = _.groupBy(mesAidesEntity.ressources, 'type');

        _.forEach(mappingSchema, function(definitions, openfiscaKey) {
            if (! _.isArray(definitions)) {
                definitions = [definitions];
            }
            _.forEach(definitions, function(definition) {

                var srcKey = definition.src || definition;
                var fn = definition.fn;

                if (ressourcesByType[srcKey]) {
                    var result = openfiscaEntity[openfiscaKey] || {};

                    _.forEach(ressourcesByType[srcKey], function(item) {
                        var montant = fn ? fn(item.montant) : item.montant;
                        if (item.periode) {
                            // Bootstrapping for current period
                            if (! result[item.periode]) {
                                result[item.periode] = 0;
                            }
                            result[item.periode] += montant;
                        }
                    });

                    // Current month resources are given their latest value when not interrupted
                    var ressourceLastMonth = _.find(ressourcesByType[srcKey], {periode : periods['1MonthsAgo']});
                    if (ressourceLastMonth && ressourceLastMonth.montant && ! _.includes(mesAidesEntity.interruptedRessources, srcKey)) {
                        result[periods.thisMonth] = result[periods.thisMonth] || 0;
                        result[periods.thisMonth] += fn ? fn(ressourceLastMonth.montant) : ressourceLastMonth.montant;
                    }

                    // When they are not formally declared, resources of the année fiscale de référence are considered equal to latest 12 month resources
                    if (! situation.ressourcesYearMoins2Captured) {
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
                    }
                    openfiscaEntity[openfiscaKey] = result;
                }
            });
        });
    }

    function buildOpenFiscaEntity(mesAidesEntity, mappingSchema, situation) {
        var periods = MappingPeriodService.getPeriods(situation.dateDeValeur);
        var monthKeys = ['thisMonth', '1MonthsAgo', '2MonthsAgo', '3MonthsAgo'].map(function (month) {
            return periods[month];
        });

        var result = {};
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

            var value = result[openfiscaKey];
            if (_.isUndefined(value) || params.copyTo3PreviousMonths === false) {
                return result;
            }
            // Most values must be defined for the latest 3 months to get correct results from OpenFisca
            result[openfiscaKey] = {};
            monthKeys.forEach(function(monthKey) {
                result[openfiscaKey][monthKey] = value;
            });
        });
        return result;
    }

    function mapFamille(situation) {
        var famille = buildOpenFiscaEntity(situation, mappingSchemas.famille, situation);
        var ressources = [];
        _.forEach(situation.individus, function(individu) {
            ressources = ressources.concat(individu.ressources);
        });

        return famille;
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
            applyRessources(individu, openfiscaIndividu, ressourceMapping.individu, situation);
            return openfiscaIndividu;
        });
    }

    function setNonInjectedPrestationsToZero(familles, individus, dateDeValeur) {
        var subjects = {
            famille: familles,
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
        situation.ressourcesYearMoins2Captured = situation.ressourcesYearMoins2Captured || SituationService.ressourcesYearMoins2Captured(situation);
        var familles = [ mapFamille(situation) ],
            individus = mapIndividus(situation);

        setNonInjectedPrestationsToZero(familles, individus, situation.dateDeValeur);

        return {
            familles: familles,
            foyers_fiscaux: [ situation.foyer_fiscal ],
            individus: individus,
            menages: [ buildOpenFiscaEntity(situation, mappingSchemas.menage, situation) ]
        };
    }

    function migratePersistedSituation(sourceSituation) {
        var situation = _.assign({}, sourceSituation);
        var ressourceMapping = {
            pensions_alimentaires_versees_ym2: 'pensions_alimentaires_versees',
        };
        situation.individus = sourceSituation.individus.map(function(sourceIndividu) {
            var individu = _.assign({}, sourceIndividu);
            individu.ressources = sourceIndividu.ressources.map(function(sourceRessource) {
                var ressource = _.assign({}, sourceRessource);
                if (ressourceMapping[ressource.type]) {
                    ressource.type = ressourceMapping[ressource.type];
                }
                return ressource;
            });
            return individu;
        });

        var periods = MappingPeriodService.getPeriods(situation.dateDeValeur);

        situation.foyer_fiscal = {};
        if (situation.rfr != 0) {
            situation.foyer_fiscal.rfr = {};
            situation.foyer_fiscal.rfr[periods.anneeFiscaleReference] = situation.rfr;
            delete situation.rfr;
        }
        return situation;
    }


    function allocateIndividualsToEntities(situation) {
        var foyer = situation.foyer_fiscal;
        foyer.declarants = [ SituationService.getDemandeur(situation).id ];
        var conjoint = SituationService.getConjoint(situation);
        if (conjoint) {
            foyer.declarants.push(conjoint.id);
        }

        var enfants = SituationService.getEnfants(situation);
        var validEnfants = _.filter(enfants, function(enfant) { return mappingSchemas.isIndividuValid(enfant, situation); });
        var enfantIds = validEnfants.map(function(enfant) { return enfant.id; });
        foyer.personnes_a_charge = enfantIds;
    }

    function buildOpenFiscaRequest(situation) {
        allocateIndividualsToEntities(situation);
        return {
            intermediate_variables: true,
            labels: true,
            scenarios: [{
                test_case: buildOpenFiscaTestCase(situation),
                period: 'month:' + MappingPeriodService.toOpenFiscaFormat(situation.dateDeValeur),
            }],
            variables: _.keys(requestedVariables).sort(),
        };
    }

    return {
        buildOpenFiscaRequest: buildOpenFiscaRequest,
        migratePersistedSituation: migratePersistedSituation,
    };
});

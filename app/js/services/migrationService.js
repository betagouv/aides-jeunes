'use strict';


angular.module('ddsCommon').factory('MigrationService', function(MappingPeriodService, MappingService, SituationService) {

    function manageKnownDiscrepancies(situationId, newRequest, legacyRequest) {
        if (situationId == '55b8caa2f0ac7bb86ba04d9b') {
            legacyRequest.scenarios[0].test_case.individus[0].frais_reels = { '2013': 0 };
        }
    }

    return {
        migratePersistedSituation: function(sourceSituation) {
            var situation = {
                dateDeValeur: sourceSituation.dateDeValeur,
            };
            var periods = MappingPeriodService.getPeriods(situation.dateDeValeur);
            var ressourceMapping = {
                pensions_alimentaires_percues_ym2: 'pensions_alimentaires_percues',
                pensions_alimentaires_versees_ym2: 'pensions_alimentaires_versees',
                salaire_imposable_ym2: 'salaire_imposable',
            };

            var individuPropertyMapping = {
                assPreconditionRemplie: 'ass_precondition_remplie',
                autoEntrepreneurActiviteType: 'tns_auto_entrepreneur_type_activite',
                dateDeNaissance: 'date_naissance',
                place: 'enfant_place',
                echelonBourse: 'echelon_bourse',
                enceinte: 'enceinte',
                gardeAlternee: 'garde_alternee',
                id: 'id',
                microEntrepriseActiviteType: 'tns_micro_entreprise_type_activite',
                perteAutonomie: 'perte_autonomie',
                role: 'role',
                scolarite: 'scolarite',
                specificSituations: 'specificSituations',
                tauxIncapacite: 'tauxIncapacite',
                tns_autres_revenus_type_activite: 'tns_autres_revenus_type_activite',
            };

            situation.individus = sourceSituation.individus.map(function(sourceIndividu) {
                var individu = {};
                Object.keys(individuPropertyMapping).forEach(function(previousPropertyName) {
                    if (sourceIndividu[previousPropertyName] !== undefined) {
                        individu[individuPropertyMapping[previousPropertyName]] = _.cloneDeep(sourceIndividu[previousPropertyName]);
                    }
                });
                individu.enfant_a_charge = {};
                individu.enfant_a_charge[moment(situation.dateDeValeur).format('YYYY')]= sourceIndividu.aCharge || (! sourceIndividu.fiscalementIndependant);
                individu.boursier = sourceIndividu.boursier || sourceIndividu.echelonBourse >= 0;

                if (sourceIndividu.statutMarital) {
                    var statutMaritalMapping = {
                        seul: 2,
                        mariage: 1,
                        pacs: 5,
                        union_libre: 2
                    };
                    if (statutMaritalMapping[sourceIndividu.statutMarital]) {
                        individu.statut_marital = statutMaritalMapping[sourceIndividu.statutMarital];
                    }
                }


                var declaredRessources = {};
                sourceIndividu.ressources.forEach(function(sourceRessource) {
                    var ressourceName = sourceRessource.type;
                    if (ressourceMapping[ressourceName]) {
                        ressourceName = ressourceMapping[ressourceName];
                    }
                    declaredRessources[ressourceName] = {};
                    individu[ressourceName] = individu[ressourceName] || {};
                    if (typeof individu[ressourceName] === 'object') {
                        individu[ressourceName][sourceRessource.periode] = individu[ressourceName][sourceRessource.periode] || 0;
                        individu[ressourceName][sourceRessource.periode] = individu[ressourceName][sourceRessource.periode] + sourceRessource.montant;
                    }

                });

                Object.keys(declaredRessources).forEach(function(ressourceName) {
                    var ressourceLastMonth = individu[ressourceName][periods['1MonthsAgo']];
                    if (ressourceLastMonth && ! _.includes(sourceIndividu.interruptedRessources, ressourceName)) {
                        individu[ressourceName][periods.thisMonth] = ressourceLastMonth;
                    }
                });

                return individu;
            });

            situation.foyer_fiscal = {};
            if (sourceSituation.rfr != 0) {
                situation.foyer_fiscal.rfr = {};
                situation.foyer_fiscal.rfr[periods.anneeFiscaleReference] = sourceSituation.rfr;
            }

            situation.menage = {
                code_postal: sourceSituation.logement.adresse.codePostal,
                coloc: sourceSituation.logement.colocation,
                depcom: sourceSituation.logement.adresse.codeInsee,
                loyer: sourceSituation.logement.loyer,
                logement_chambre: sourceSituation.logement.isChambre,
                participation_frais: sourceSituation.logement.participationFrais,
                statut_occupation_logement: MappingService.statutOccupationLogement.getValue(sourceSituation.logement),
            };
            if (sourceSituation.logement.charges !== undefined && sourceSituation.logement.charges !== null) {
                situation.menage.charges_locatives = sourceSituation.logement.charges;
            }

            situation.famille = {
                parisien : sourceSituation.logement.inhabitantForThreeYearsOutOfLastFive,
                proprietaire_proche_famille: sourceSituation.logement.membreFamilleProprietaire,
                rsa_isolement_recent: sourceSituation.individus[0].isolementRecent,
            };

            var patrimoineMap = {
                epargneSansRevenus: 'epargne_non_remuneree',
                valeurLocativeImmoNonLoue: 'valeur_locative_immo_non_loue',
                valeurLocativeTerrainNonLoue: 'valeur_locative_terrains_non_loue',
            };
            var sourcePatrimoine = sourceSituation.patrimoine || {};
            Object.keys(patrimoineMap).forEach(function(patrimoineFieldName) {
                situation.individus[0][patrimoineMap[patrimoineFieldName]] = { '2012-01': sourcePatrimoine[patrimoineFieldName] || 0 };
            });
            situation.individus[0].interets_epargne_sur_livrets = { '2012-01' : 0.01 * (sourcePatrimoine.epargneSurLivret || 0) };

            var patrimoineValues = _.values(patrimoineMap);
            patrimoineValues.push('interets_epargne_sur_livrets');

            situation.individus.slice(1).forEach(function(individu) {
                patrimoineValues.forEach(function(patrimoineFieldName) {
                    individu[patrimoineFieldName] = { '2012-01': 0 };
                });
            });

            return situation;
        },
        ressourcesYearMoins2Captured: function(situation) {
            var categoriesRncIds = [
                'salaire_imposable_ym2',
                'chomage_imposable',
                'retraite_imposable',
                'frais_reels',
                'pensions_alimentaires_percues_ym2',
                'pensions_alimentaires_versees',
            ];
            return (typeof situation.rfr == 'number') || situation.individus.some(function(individu) {
                    return individu.ressources && individu.ressources.some(function(ressource) {
                        return categoriesRncIds.indexOf(ressource.type) >= 0;
                    });
                });
        },
        persistedSituationPretransformationUpdate: function(situation) {
            if (situation.ressourcesYearMoins2Captured && (! this.ressourcesYearMoins2Captured(situation))) {
                var ym2 = moment(situation.dateDeValeur).subtract('years', 2).format('YYYY');
                //var januaryYm2 = ym2 + '-01';

                situation.individus[0].ressources.push({
                    montant: 0,
                    periode: ym2,
                    type: 'frais_reels',
                });
            }
        },
        precomparisonUpdate: function(situationId, newRequest, legacyRequest) {
            var props = ['coloc', 'logement_chambre'];
            var newMenage = newRequest.scenarios[0].test_case.menages[0];
            var legacyMenage = legacyRequest.scenarios[0].test_case.menages[0];
            props.forEach(function(prop) {
                if (! newMenage[prop]) {
                    if (_.every(legacyMenage[prop], function(value, key) { return ! value; })) {
                        delete legacyMenage[prop];
                    }
                }
            });
            manageKnownDiscrepancies(situationId, newRequest, legacyRequest);
        }
    };
});

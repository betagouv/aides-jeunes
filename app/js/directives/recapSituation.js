'use strict';

angular.module('ddsRecapSituation').directive('recapSituation', function($timeout, $sce, ressourceTypes, categoriesRnc, logementTypes, nationalites, IndividuService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/recap-situation.html',
        scope: {
            situation: '='
        },
        controller: function($scope) {
            var situation = $scope.situation;

            $scope.rfrCaptured = $scope.situation.rfr || $scope.situation.rfr === 0;

            $scope.yearMoins2 = moment(situation.dateDeValeur).subtract(2, 'years').format('YYYY');

            var individuLabel = function(individu) {
                if ('demandeur' === individu.role) {
                    return 'Demandeur';
                } else if ('conjoint' === individu.role) {
                    return 'Conjoint';
                } else {
                    return individu.firstName + ' (' + individu.role + ')';
                }
            };

            var mapIndividuRessources = function(individu) {
                var result = [];
                var ressources = _.groupBy(individu.ressources, 'type');
                _.forEach(ressources, function(subRessources, type) {
                    if (_.find(categoriesRnc, { id: type })) {
                        return;
                    }
                    var ressourceType = _.find(ressourceTypes, { id: type });
                    var label = ressourceType ? ressourceType.label : type + ' (cette ressource n\'est plus capturée)';
                    var values = { type: label, values: [] };
                    result.push(values);
                    for (var i = 0; i < 3; i++) {
                        var ressource = subRessources[i];
                        if (ressource) {
                            values.values.push({
                                periode: moment(ressource.periode, 'YYYY-MM').format('MMMM YYYY'),
                                montant: ressource.montant
                            });
                        }
                    }

                    var montants = _.pluck(subRessources, 'montant');
                    var montantAnnuel = _.reduce(montants, function(sum, montant) {
                        return sum + montant;
                    });
                    values.values.push({
                        periode: 'Année glissante',
                        montant: Math.round(montantAnnuel)
                    });
                });

                return result;
            };

            var mapIndividu = function(individu) {
                var nationalite = _.find(nationalites, { id: individu.nationalite });
                nationalite = nationalite ? nationalite.label : 'inconnue';
                var target = {
                    label: individuLabel(individu),
                    dateDeNaissance: individu.dateDeNaissance.format('L'),
                    age: moment(situation.dateDeValeur).diff(individu.dateDeNaissance, 'years'),
                    nationalite: nationalite,
                    statutsSpecifiques: IndividuService.formatStatutsSpecifiques(individu),
                    ressources: mapIndividuRessources(individu)
                };

                return target;
            };

            var mapRessourcesYearMoins2 = function() {
                var target = _.map(IndividuService.getParents($scope.situation.individus), function(individu) {
                    var individuVM = { label: individuLabel(individu), ressources: [] };
                    categoriesRnc.forEach(function(categorieRnc) {
                        var ressource = _.find(individu.ressources, { type: categorieRnc.id });
                        if (ressource) {
                            individuVM.ressources.push({
                                label: categorieRnc.label,
                                montant: ressource.montant
                            });
                        }
                    });
                    return individuVM;
                });

                return target;
            };

            $scope.ressourcesYearMoins2 = mapRessourcesYearMoins2();

            var mapPatrimoine = function(patrimoine) {
                $scope.patrimoine = [];
                [
                    {
                        id: 'valeurLocativeImmoNonLoue',
                        label: 'Valeur locative immobilier non loué'
                    },
                    {
                        id: 'valeurLocativeTerrainNonLoue',
                        label: 'Valeur locative terrains non loués'
                    },
                    {
                        id: 'epargneSurLivret',
                        label: 'Epargne sur livret'
                    },
                    {
                        id: 'epargneSansRevenus',
                        label: 'Epargne sans revenus'
                    }
                ].forEach(function(field) {
                    if (patrimoine[field.id]) {
                        $scope.patrimoine.push({label: field.label, montant: patrimoine[field.id]});
                    }
                });

                $scope.revenusDuPatrimoine = [];
                [
                    {
                        id: 'revenusDuCapital',
                        label: 'Revenus du capital'
                    },
                    {
                        id: 'revenusLocatifs',
                        label: 'Revenus locatifs'
                    }
                ].forEach(function(field) {
                    var revenus = patrimoine[field.id];
                    if (revenus.length) {
                        var value = {label: field.label, values: []};
                        $scope.revenusDuPatrimoine.push(value);
                        for (var i = 0; i < 3; i++) {
                            var ressource = revenus[i];
                            value.values.push({
                                periode: moment(ressource.periode, 'YYYY-MM').format('MMMM YYYY'),
                                montant: ressource.montant
                            });
                        }
                        var montants = _.pluck(revenus, 'montant');
                        var montantAnnuel = _.reduce(montants, function(sum, montant) {
                            return sum + montant;
                        });
                        value.values.push({periode: 'Année glissante', montant: montantAnnuel});
                    }
                });
            };

            var mapLogement = function(logement) {
                var typeLogementHtml = _.find(logementTypes, { id: logement.type }).label;
                if ('locataire' === logement.type) {
                    typeLogementHtml += ' d\'un logement de type ' + logement.locationType;
                    typeLogementHtml += '<br>Colocation : ' + (logement.coloc ? 'oui' : 'non');
                    typeLogementHtml += '<br>Propriétaire du logement membre de la famille : ';
                    typeLogementHtml += (logement.membreFamilleProprietaire ? 'oui' : 'non');
                    if ('foyer' !== logement.locationType) {
                        typeLogementHtml += '<br>Chambre : ' + (logement.isChambre ? 'oui' : 'non');
                    }
                } else if ('proprietaire' === logement.type) {
                   typeLogementHtml += ', prêt en accession : ';
                    if (logement.primoAccedant) {
                       typeLogementHtml += 'oui, prêt conventionné : ' + (logement.pretConventionne ? 'oui' : 'non');
                    } else {
                       typeLogementHtml += 'non';
                    }
                }

                $scope.logement = {
                    type: $sce.trustAsHtml(typeLogementHtml),
                    loyer: logement.loyer,
                    codePostal: logement.adresse.codePostal,
                    nomCommune: logement.adresse.nomCommune
                };
            };
            $scope.individus = _.map(situation.individus, mapIndividu);

            if (situation.patrimoine) {
                mapPatrimoine(situation.patrimoine);
            }

            mapLogement(situation.logement);
        }
    };
});

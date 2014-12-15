'use strict';

angular.module('ddsCommon').directive('humanReadableSituation', function($timeout, ressourceTypes, logementTypes, nationalites, IndividuService) {
    return {
        restrict: 'E',
        templateUrl: '/acceptance-tests/partials/situation.html',
        scope: {
            situation: '='
        },
        controller: function($scope) {
            var situation = $scope.situation;

            $scope.individus = _.map(situation.individus, function(individu) {
                var target = {};
                if ('demandeur' === individu.role) {
                    target.label = 'Demandeur';
                } else if ('conjoint' === individu.role) {
                    target.label = 'Conjoint';
                } else {
                    target.label = individu.firstName + ' (' + individu.role + ')';
                }

                target.dateDeNaissance = individu.dateDeNaissance;
                var dateNaissance = moment(individu.dateDeNaissance);
                target.age = moment(situation.dateDeValeur).diff(dateNaissance, 'years');

                target.nationalite = _.find(nationalites, {id: individu.nationalite}).label;

                target.statutsSpecifiques = IndividuService.formatStatutsSpecifiques(individu);

                target.ressources = [];
                var ressources = individu.ressources;
                ressources = _.groupBy(ressources, 'type');
                _.forEach(ressources, function(subRessources, type) {
                    var ressourceType = _.find(ressourceTypes, {id: type});
                    var label = ressourceType ? ressourceType.label : type + ' (cette ressource n\'est plus capturée)';
                    var values = { type: label, values: [] };
                    target.ressources.push(values);
                    for (var i = 0; i < 3; i++) {
                        var ressource = subRessources[i];
                        values.values.push({
                            periode: moment(ressource.periode, 'YYYY-MM').format('MMMM YYYY'),
                            montant: ressource.montant
                        });
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

                return target;
            });

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
                if (situation.patrimoine[field.id]) {
                    $scope.patrimoine.push({label: field.label, montant: situation.patrimoine[field.id]});
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
                var revenus = situation.patrimoine[field.id];
                if (revenus.length) {
                    var value = {label: field.label, values: []};
                    $scope.revenusDuPatrimoine.push(value);
                    for (var i = 0; i < 3; i++) {
                        var ressource = revenus[i];
                        value.values.push({periode: moment(ressource.periode, 'YYYY-MM').format('MMMM YYYY'), montant: ressource.montant});
                    }
                    var montants = _.pluck(revenus, 'montant');
                    var montantAnnuel = _.reduce(montants, function(sum, montant) {
                        return sum + montant;
                    });
                    value.values.push({periode: 'Année glissante', montant: montantAnnuel});
                }
            });

            $scope.logement = { type : _.find(logementTypes, {id: situation.logement.type}).label };
            if ('locataire' === situation.logement.type) {
                $scope.logement.type += ' d\'un logement de type ' + situation.logement.locationType;
                $scope.logement.type += '<br>Colocation : ' + (situation.logement.coloc ? 'oui' : 'non');
                $scope.logement.type += '<br>Propriétaire du logement membre de la famille : ' + (situation.logement.membreFamilleProprietaire ? 'oui' : 'non');
            } else if ('proprietaire' === situation.logement.type) {
                $scope.logement.type += ', prêt en accession : ';
                if (situation.logement.primoAccedant) {
                    $scope.logement.type += 'oui, prêt conventionné : ' + (situation.logement.pretConventionne ? 'oui' : 'non');
                } else {
                    $scope.logement.type += 'non';
                }
            }

            $scope.logement.loyer = situation.logement.loyer;
            $scope.logement.codePostal = situation.logement.adresse.codePostal;
            $scope.logement.ville = situation.logement.adresse.ville;
        }
    };
});

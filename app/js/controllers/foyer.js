'use strict';

angular.module('ddsApp').controller('FoyerCtrl', function($scope, $state, $modal, $filter, nationalites, logementTypes, locationTypes, SituationService, IndividuService) {
    var situation = $scope.situation = SituationService.restoreLocal();
    $scope.statutsSpecifiques = IndividuService.formatStatutsSpecifiques;
    $scope.nationalite = IndividuService.nationaliteLabel;

    $scope.ressourcesCaptured = situation.individus.length > 0 && !!situation.individus[0].ressources;

    var buildRecapLogement = function() {
        var logementLabel = _.find(logementTypes, { id: situation.logement.type }).label;
        logementLabel = $filter('uppercaseFirst')(logementLabel);
        $scope.recapLogement = '<b>' + logementLabel + '</b>';
        if ('locataire' === situation.logement.type) {
            $scope.recapLogement += ' d’un logement <b>';
            $scope.recapLogement += _.find(locationTypes, { id: situation.logement.locationType }).label;
            $scope.recapLogement += '</b>';
            $scope.loyerLabel = 'Loyer';
        } else {
            $scope.loyerLabel = 'Mensualité d’emprunt';
        }
    };

    if (situation.logement) {
        buildRecapLogement();
    }

    var buildRecapPatrimoine = function() {
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
    };

    if (situation.patrimoine) {
        buildRecapPatrimoine();
    }

    $scope.$on('individu.demandeur', function(e, demandeur) {
        if (_.find(situation.individus, { role: 'demandeur' })) {
            situation.individus[0] = demandeur;
        } else {
            situation.individus.push(demandeur);
        }
        $state.go('foyer.conjoint');
    });

    $scope.$on('individu.conjoint', function(e, conjoint) {
        if (conjoint) {
            // si le conjoint existait déjà avant, on l'écrase
            if (_.find(situation.individus, { role: 'conjoint' })) {
                situation.individus[1] = conjoint;
            } else { // on insère le conjoint juste derrière le demandeur dans l'array des individus
                situation.individus.splice(1, 0, conjoint);
            }
        } else { // on supprime l'éventuel conjoint qui existait avant
            situation.individus = _.filter(situation.individus, function(individu) {
                return 'conjoint' !== individu.role;
            });
        }
        $state.go('foyer.enfants');
    });

    $scope.$on('enfants', function(e, enfants) {
        situation.individus = _.filter(situation.individus, function(individu) {
            return 'enfant' !== individu.role;
        });
        situation.individus.push.apply(situation.individus, enfants);
        $state.go('foyer.personnesACharge');
    });

    $scope.$on('personnesACharge', function(e, personnesACharge) {
        situation.individus = _.filter(situation.individus, function(individu) {
            return 'personneACharge' !== individu.role;
        });
        situation.individus.push.apply(situation.individus, personnesACharge);
        $state.go('foyer.logement');
    });

    $scope.$on('logement', function(e, logement) {
        situation.logement = logement;
        buildRecapLogement();
        $state.go('foyer.ressources');
    });

    $scope.$on('ressources', function() {
        $scope.ressourcesCaptured = true;
        $state.go('foyer.patrimoine');
    });

    $scope.$on('patrimoine', function(e, patrimoine) {
        situation.patrimoine = patrimoine;
        buildRecapPatrimoine();
        SituationService.create(situation).then(function(result) {
            $state.go('foyer.simulation', { 'situationId': result._id });
        });
    });
});

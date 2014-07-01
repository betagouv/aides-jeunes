'use strict';

angular.module('ddsApp').controller('MainCtrl', function ($scope, $routeParams, $location, situationData, SituationService, SimulationService) {
    $scope.questionName = $routeParams.questionName ? _s.camelize($routeParams.questionName) : undefined;
    $scope.entityId = $routeParams.entityId;
    $scope.situationId = situationData._id;

    $scope.updateSituation = function () {
        SituationService.update($scope.situationId, situation.flatten($scope.demandeur)).success(function(data) {
            $scope.demandeur = situation.expand(data);
            $scope.computeSituation();
        });
    };

    $scope.computeSituation = function() {
        console.log('Computing...');
        $scope.elig = {};
        try {
            $scope.demandeur.get('statutMarital');
            $scope.demandeur.get('dateDeNaissance');
            $scope.demandeur.get('retraite');
            if ($scope.demandeur.conjoint) {
                $scope.demandeur.conjoint.get('dateDeNaissance');
                $scope.demandeur.conjoint.get('retraite');
            }
            $scope.demandeur.get('enfants');
            $scope.elig.rsa = rsa.estEligibleRSA($scope.demandeur);
            $scope.elig.aideLogement = aideLogement.estEligibleAideLogement($scope.demandeur);
            $scope.demandeur.ressourcesTroisDerniersMois();
            if ($scope.demandeur.conjoint) $scope.demandeur.conjoint.ressourcesTroisDerniersMois();
            if ($scope.demandeur.enfants) {
                _.forEach($scope.demandeur.enfants, function(enfant) {
                    enfant.get('retraite');
                    enfant.ressourcesTroisDerniersMois();
                });
            }

            console.log('Computed!', $scope.elig);
            SimulationService.simulate($scope.situationId).then(function(result) {
                $scope.aides = result;
            });
        } catch(e) {
            if (!(e instanceof situation.ComputingError)) throw e;
            $location.path('/configuration/' + $routeParams.situationId + '/' + e.entity.id + '/' + _s.dasherize(e.claimedAttributes[0]));
            console.log('Computing error', e);
        }
    };

    $scope.demandeur = situation.expand(situationData);
    if (!$routeParams.entityId || !$routeParams.questionName) $scope.computeSituation();
});

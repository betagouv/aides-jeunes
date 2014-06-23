'use strict';

angular.module('ddsApp').controller('MainCtrl', function ($scope, $http, $routeParams, $location) {
    var aides = prestations;

    $scope.questionName = $routeParams.questionName ? _s.camelize($routeParams.questionName) : undefined;
    $scope.entityId = $routeParams.entityId;

    $http.get('/api/situations/' + $routeParams.situationId).success(function(data) {
        $scope.demandeur = situation.expand(data);
        if (!$routeParams.entityId || !$routeParams.questionName) $scope.computeSituation();
    });

    $scope.situationId = $routeParams.situationId;

    $scope.updateSituation = function () {
        $http.put('/api/situations/' + $routeParams.situationId, situation.flatten($scope.demandeur)).success(function(data) {
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
            $scope.simulate();
        } catch(e) {
            if (!(e instanceof situation.ComputingError)) throw e;
            $location.path('/configuration/' + $routeParams.situationId + '/' + e.entity.id + '/' + _s.dasherize(e.claimedAttributes[0]));
            console.log('Computing error', e);
        }
    };

    $scope.simulate = function () {
        console.log('Simulating...');
        $http.get('/api/situations/' + $routeParams.situationId + '/simulation').success(function(data) {
            $scope.aides = [];
            _.forEach(data, function(value, aide) {
                if (!(aide in aides)) return;
                var obj = { partial: aides[aide].partial };
                if (aides[aide].type === Number && value > 0) {
                    obj.montant = value;
                    $scope.aides.push(obj);
                }
                if (aides[aide].type === Boolean && value === true) {
                    $scope.aides.push(obj);
                }
            });
            console.log('Simulated!', data);
        });
    };
});

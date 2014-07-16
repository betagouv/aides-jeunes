'use strict';

angular.module('ddsApp').controller('ResultatCtrl', function($scope, $http, SituationService) {
    $scope.awaitingResults = true;
    var situation = SituationService.restoreLocal();
    situation.demandeur.dateDeNaissance = moment(situation.demandeur.birthDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    if (situation.conjoint) {
        situation.conjoint.dateDeNaissance = situation.conjoint.birthDate.format('YYYY-MM-DD');
    }

    $http.post('/api/situations', situation).then(function(result) {
        console.log(situation);
        $http.get('/api/situations/' + result.data._id + '/simulation').then(function() {
            $scope.awaitingResults = false;
        }, function() {
            $scope.error = true;
        });
    }, function() {
        $scope.error = true;
    }).finally(function() {
        $scope.awaitingResults = false;
    });
});

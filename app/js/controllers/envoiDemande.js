'use strict';

angular.module('ddsApp').controller('EnvoiDemandeCtrl', function ($http, $scope, $stateParams) {
    $scope.contact = {};
    $scope.send = function (form) {
        $scope.formSubmitted = true;
        if (form.$invalid) {
            return;
        }

        var baseSituationUrl = '/api/situations/' + $stateParams.situationId;
        $http.put(baseSituationUrl, {contact: $scope.contact}).success(function() {
            $http.post(baseSituationUrl + '/submit').success(function() {
                $scope.formSent = true;
            });
        });
    };
});

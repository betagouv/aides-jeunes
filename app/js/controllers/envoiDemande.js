'use strict';

angular.module('ddsApp').controller('EnvoiDemandeCtrl', function ($http, $scope, $routeParams) {
    $scope.contact = {};
    $scope.send = function (form) {
        $scope.formSubmitted = true;
        if (form.$invalid) {
            return;
        }

        var baseSituationUrl = '/api/situations/' + $routeParams.situationId;
        $http.put(baseSituationUrl, {contact: $scope.contact}).success(function() {
            $http.post(baseSituationUrl + '/submit').success(function() {
                $scope.formSent = true;
            })
        });
    };
});

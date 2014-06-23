'use strict';

angular.module('ddsApp').controller('EnvoiDemandeCtrl', function ($http, $scope, $routeParams) {
    $scope.contact = {};
    $scope.send = function (form) {
        $scope.formSubmitted = true;
        if (form.$invalid) {
            return;
        }

        $http.put('/api/situations/' + $routeParams.situationId, {contact: $scope.contact}).success(function() {
            $scope.formSent = true;
        });
    };
});

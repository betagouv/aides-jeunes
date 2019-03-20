'use strict';

angular.module('ddsApp').directive('cityAutosuggest', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/partials/city-autosuggest.html',
        scope: {
            menage: '=',
        },
        controller: 'cityAutosuggestCtrl',
        link: function(scope, element) {

            scope.matches = [];
            scope.value = '';
            scope.loading = false;

            if (scope.menage.code_postal && scope.menage.nom_commune) {
                scope.value = scope.menage.nom_commune;
            }

            var doSearch = function(value) {
                scope.loading = true;
                $http
                    .get('/api/outils/communes/search?q=' + value)
                    .then(function(result) {
                        scope.loading = false;
                        scope.matches = result.data;
                    });
            };

            var debounced = _.debounce(doSearch, 500);

            element.bind('keyup', function(e) {
                debounced(e.target.value);
            });

        }
    };
});

angular.module('ddsApp').controller('cityAutosuggestCtrl', function($scope) {
    $scope.select = function(city) {
        $scope.matches = [];
        $scope.value = city.nom;

        $scope.menage.nom_commune = city.nom;
        $scope.menage.code_postal = city.codesPostaux[0];
        $scope.menage.depcom = city.code;
    };
});

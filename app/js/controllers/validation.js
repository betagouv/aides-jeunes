'use strict';

angular.module('ddsApp').controller('ValidationCtrl', function($scope, $http) {
    var sourceNames = [{
        name: 'Prestations nationales',
        id: 'openfisca-france'
    }, {
        name: 'Prestations de la ville de Paris',
        id: 'openfisca-paris'
    }, {
        name: 'Prestations de la métropole de Rennes',
        id: 'openfisca-rennesmetropole'
    }];
    $scope.sources = sourceNames.map(function(source) {
        $http.get('http://ludwig.incubateur.net/api/repositories/github/sgmap/' + source.id + '/tests')
        .then(function(response) {
            source.tests = response.data;
        });
        return source;
    });
});

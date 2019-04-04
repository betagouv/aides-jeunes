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

    $scope.formatTestData = function(test) {
        var testData = _.omit(test, 'name', 'description', 'keywords');
        var keys = Object.keys(testData);
        keys.forEach(function(key) {
            var property = testData[key];
            if (property instanceof Array) {
                property.forEach(function(entity) {
                    var variables = Object.keys(entity);
                    variables.forEach(function(variable) {
                        var values = Object.values(entity[variable]);
                        var firstValue = values[0];
                        if (_.every(values, function(v) { return v === firstValue; })) {
                            if (firstValue == 0 || _.isUndefined(firstValue)) {
                                delete entity[variable];
                            } else {
                                entity[variable] = firstValue;
                            }
                        }
                    });
                });
            }
        });
        return jsyaml.dump(testData);
    };

    $scope.sources = sourceNames.map(function(source) {
        $http.get('https://ludwig.incubateur.net/api/repository/github/ludwig-test/' + source.id + '/tests')
            .then(function(response) {
                source.tests = response.data;
            }, function() {
                source.error = 'Récupération des informations impossible';
            });
        return source;
    });
});

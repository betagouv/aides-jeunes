'use strict';

angular.module('ddsApp').factory('CityService', function($http) {

    var cityIndexByPostalCode = {};

    function getCities(postalCode) {
        if (cityIndexByPostalCode[postalCode])
            return cityIndexByPostalCode[postalCode];

        cityIndexByPostalCode[postalCode] = $http
        .get('/api/outils/communes/' + postalCode)
        .then(function(result) {
            return result.data;
        }, function(error) {
            return [];
        });

        return cityIndexByPostalCode[postalCode];
    }

    return {
        getCities: getCities,
    };
});

'use strict';

angular.module('ddsApp').factory('CityService', function($http) {

    var cityIndexByPostalCode = {};

    function sortByName(aCity, bCity) {
        if (aCity.nomCommune < bCity.nomCommune)
            return -1;
        if (aCity.nomCommune > bCity.nomCommune)
            return 1;

        return 0;
    }

    function getCities(postalCode) {
        if (cityIndexByPostalCode[postalCode])
            return cityIndexByPostalCode[postalCode];

        cityIndexByPostalCode[postalCode] = $http
        .get('/api/outils/communes/' + postalCode)
        .then(function(result) {
            return result.data.sort(sortByName);
        }, function(error) {
            return [];
        });

        return cityIndexByPostalCode[postalCode];
    }

    return {
        getCities: getCities,
    };
});

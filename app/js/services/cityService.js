'use strict';

angular.module('ddsApp').factory('CityService', function($http) {

    var cityIndexByPostalCode = {};
    var cityIndexByInseeCode = {};

    function enrichInseeIndex(cities) {
        cities.forEach(function(city) {
            cityIndexByInseeCode[city.codeInsee] = city;
        });
    }

    function getCities(postalCode) {
        if (cityIndexByPostalCode[postalCode])
            return cityIndexByPostalCode[postalCode];

        return cityIndexByPostalCode[postalCode] = $http
        .get('/api/outils/communes/' + postalCode)
        .then(function(result) {
            enrichInseeIndex(result.data);
            return result.data;
        }, function(error) {
            return [];
        });
    }

    function getCity(codeInsee) {
        return cityIndexByInseeCode[codeInsee];
    }

    return {
        getCities: getCities,
        getCity: getCity,
    };
});

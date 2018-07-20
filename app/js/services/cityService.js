'use strict';

angular.module('ddsCommon').factory('CityService', function($http) {
    function sortByName(aCity, bCity) {
        if (aCity.nomCommune < bCity.nomCommune)
            return -1;
        if (aCity.nomCommune > bCity.nomCommune)
            return 1;

        return 0;
    }

    function getCities(postalCode) {
        return $http
            .get('/api/outils/communes/' + postalCode)
            .then(function(result) {
                return result.data.sort(sortByName);
            }, function(error) {
                return [];
            });
    }

    return {
        getCities: getCities,
    };
});

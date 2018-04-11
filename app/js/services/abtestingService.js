'use strict';

angular.module('ddsCommon').factory('ABTestingService', function($localStorage, $analytics) {
    function setABTestingEnvironment() {
        $localStorage.ABTesting = $localStorage.ABTesting || {};
        $localStorage.ABTesting.ressource = $localStorage.ABTesting.ressource || { index: 1 };
        $localStorage.ABTesting.ressource.deleted = true;

        $localStorage.ABTesting.contact = $localStorage.ABTesting.contact || { index: 1 };
        $localStorage.ABTesting.contact.deleted = true;

        _.forEach($localStorage.ABTesting, function(data, name) {
            if (data.deleted) {
                $analytics.deleteCustomVariable(data.index, 'visit');
            } else {
                $analytics.setCustomVariable(data.index, name, data.value, 'visit');
            }
        });

        return $localStorage.ABTesting;
    }

    function getABTestingEnvironment() {
        return $localStorage.ABTesting;
    }

    return {
        setABTestingEnvironment: setABTestingEnvironment,
        getABTestingEnvironment: getABTestingEnvironment,
    };
});

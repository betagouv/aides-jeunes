'use strict';

angular.module('ddsCommon').factory('ABTestingService', function($localStorage, $analytics) {
    function setABTestingEnvironment() {
        $localStorage.ABTesting = $localStorage.ABTesting || {};
        $localStorage.ABTesting.ressource = $localStorage.ABTesting.ressource || { index: 1 };
        $localStorage.ABTesting.ressource.value = $localStorage.ABTesting.ressource.value || (Math.random() > 0.5 ? 'A' : 'B');

        _.forEach($localStorage.ABTesting, function(data, name) {
            $analytics.setCustomVariable(data.index, name, data.value, 'visit');
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

'use strict';

angular.module('ddsCommon').factory('ABTestingService', function($localStorage, $analytics) {
    /*
     * L'AB testing repose sur les custom variables de Matomo
     * https://matomo.org/docs/custom-variables/
     */
    function getEnvironment() {
        $localStorage.ABTesting = $localStorage.ABTesting || {};

        // // Prépare la variable d'AB testing
        // $localStorage.ABTesting.link = $localStorage.ABTesting.link || { index: 1 };
        // // Réparti les visiteurs l'AB testing avec cette variable
        // $localStorage.ABTesting.link.value = $localStorage.ABTesting.link.value || (Math.random() > 0.5 ? 'A' : 'B');
        // // Après l'AB testing
        // // Pour le désactiver
        // // et libérer une custom variable
        // // $localStorage.ABTesting.link.deleted = true;

        $localStorage.ABTesting.resultat = $localStorage.ABTesting.resultat || { index: 1 };
        $localStorage.ABTesting.resultat.value = $localStorage.ABTesting.resultat.value || (Math.random() > 0.5 ? 'A' : 'B');
        $localStorage.ABTesting.resultat.deleted = true;

        _.forEach($localStorage.ABTesting, function(data, name) {
            if (data.deleted) {
                $analytics.deleteCustomVariable(data.index, 'visit');
            } else {
                $analytics.setCustomVariable(data.index, name, data.value, 'visit');
            }
        });

        return $localStorage.ABTesting;
    }

    function setVariante(key, value) {
        var env = getEnvironment();
        env[key].value = value;
        return env;
    }

    return {
        getEnvironment: getEnvironment,
        setVariante: setVariante,
    };
});

'use strict';

angular.module('ddsCommon').factory('ABTestingService', function($localStorage, $analytics) {
    /*
     * L'AB testing repose sur les custom variables de Matomo
     * https://matomo.org/docs/custom-variables/
     *
     * NB :
     * *  Les variables d'AB testing sont enregistrées dans le localStorage pour toujours
    *       -> afficher la même version pour un usager donné
     * *  L'utilisation des 5 customs variables de Piwik permet de
    *       -> faire 5 tests différents en même temps
     * *  La suppression des variables en fin de test permet de
     *      -> ne pas polluer Matomo d'anciennes périodes de tests
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

        // $localStorage.ABTesting.datepicker = $localStorage.ABTesting.datepicker || { index: 2 };
        // // Ugly fix because A/B wasn't triggering any changes in the UI
        // if ($localStorage.ABTesting.datepicker.value) {
        //     if ($localStorage.ABTesting.datepicker.value === 'A' && $localStorage.ABTesting.datepicker.value === 'B') {
        //         delete $localStorage.ABTesting.datepicker.value;
        //     }
        // }
        // $localStorage.ABTesting.datepicker.value = $localStorage.ABTesting.datepicker.value || (Math.random() > 0.5 ? 'Current' : 'New');
        // $localStorage.ABTesting.datepicker.deleted = true;

        $localStorage.ABTesting.resourceHelp = $localStorage.ABTesting.resourceHelp || { index: 3 };
        $localStorage.ABTesting.resourceHelp.value = $localStorage.ABTesting.resourceHelp.value || (Math.random() > 0.5 ? 'Show' : 'Hide');
        $localStorage.ABTesting.resourceHelp.deleted = true;

        $localStorage.ABTesting.noSpecificSituationCheckbox = $localStorage.ABTesting.noSpecificSituationCheckbox || { index: 4 };
        $localStorage.ABTesting.noSpecificSituationCheckbox.value = $localStorage.ABTesting.noSpecificSituationCheckbox.value || (Math.random() > 0.5 ? 'Show' : 'Hide');
        $localStorage.ABTesting.noSpecificSituationCheckbox.deleted = true;

        $localStorage.ABTesting.nationaliteWidget = $localStorage.ABTesting.nationaliteWidget || { index: 5 };
        $localStorage.ABTesting.nationaliteWidget.value = $localStorage.ABTesting.nationaliteWidget.value || (Math.random() > 0.5 ? 'radio3' : 'select3');
        if ($localStorage.ABTesting.nationaliteWidget.value) {
            if ($localStorage.ABTesting.nationaliteWidget.value === 'radio' ||
                $localStorage.ABTesting.nationaliteWidget.value === 'radio2') {
                $localStorage.ABTesting.nationaliteWidget.value = 'radio3';
            } else if ($localStorage.ABTesting.nationaliteWidget.value === 'select' ||
                $localStorage.ABTesting.nationaliteWidget.value === 'select2') {
                $localStorage.ABTesting.nationaliteWidget.value = 'select3';
            }
        }
        //$localStorage.ABTesting.nationaliteWidget.deleted = true;

        $localStorage.ABTesting.resourceSearch = $localStorage.ABTesting.resourceSearch || { index: 1 };
        $localStorage.ABTesting.resourceSearch.value = $localStorage.ABTesting.resourceSearch.value || (Math.random() > 0.5 ? 'Show' : 'Hide');

        $localStorage.ABTesting.version = $localStorage.ABTesting.version || { index: 2, value: 'AngularJS' };

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

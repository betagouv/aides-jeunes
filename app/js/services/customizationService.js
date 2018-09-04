'use strict';

angular.module('ddsCommon').factory('CustomizationService', function(lyonMetropoleInseeCodes) {

    function determineCustomizationId(testCase, currentPeriod) {
        if (testCase.menages &&
            testCase.menages._) {
            if (testCase.menages._.depcom[currentPeriod].match(/^93/))
                return 'D93-SSD';
            if (testCase.menages._.depcom[currentPeriod].match(/^75/))
                return 'D75-PARIS';
            if (testCase.menages._.depcom[currentPeriod].match(/^14/))
                return 'D14-CALVADOS';
            if (testCase.menages._.depcom[currentPeriod].match(/^33/))
                return 'D33-GIRONDE';
            if (_.includes(lyonMetropoleInseeCodes, testCase.menages._.depcom[currentPeriod]))
                return 'M69-LYON';
        }

        return undefined;
    }

    return {
        determineCustomizationId: determineCustomizationId,
    };
});

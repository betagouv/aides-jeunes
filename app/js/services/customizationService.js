'use strict';

angular.module('ddsCommon').factory('CustomizationService', function() {

    function determineCustomizationId(testCase, currentPeriod) {
        if (testCase.menages &&
            testCase.menages[0]) {
            if (testCase.menages[0].depcom[currentPeriod].match(/^93/))
                return 'D93-SSD';
            if (testCase.menages[0].depcom[currentPeriod].match(/^75/))
                return 'D75-PARIS';
        }

        return undefined;
    }

    return {
        determineCustomizationId: determineCustomizationId,
    };
});

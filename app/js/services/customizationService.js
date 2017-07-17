'use strict';

angular.module('ddsCommon').factory('CustomizationService', function() {

    function determineCustomizationId(testCase, currentPeriod) {
        if (testCase.menages &&
            testCase.menages[0] &&
            testCase.menages[0].depcom[currentPeriod].match(/^93/))
            return 'D93-SSD';

        return undefined;
    }

    return {
        determineCustomizationId: determineCustomizationId,
    };
});

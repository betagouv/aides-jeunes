'use strict';

angular.module('ddsCommon').factory('CustomizationService', function(lyonMetropoleInseeCodes) {

    function determineCustomizationId(testCase, currentPeriod) {
        if (testCase.menages &&
            testCase.menages._) {
            if (testCase.menages._.depcom[currentPeriod].match(/^06/))
                return 'D06-ALPES_MARITIMES';
            if (testCase.menages._.depcom[currentPeriod].match(/^13/))
                return 'D13-BDR';
            if (testCase.menages._.depcom[currentPeriod].match(/^14/))
                return 'D14-CALVADOS';
            if (testCase.menages._.depcom[currentPeriod].match(/^31/))
                return 'D31-HAUTE_GARONNE';
            if (testCase.menages._.depcom[currentPeriod].match(/^33/))
                return 'D33-GIRONDE';
            if (testCase.menages._.depcom[currentPeriod].match(/^34/))
                return 'D34-HERAULT';
            if (testCase.menages._.depcom[currentPeriod].match(/^44/))
                return 'D44-LOIRE_ATLANTIQUE';
            if (testCase.menages._.depcom[currentPeriod].match(/^59/))
                return 'D59-NORD';
            if (testCase.menages._.depcom[currentPeriod].match(/^62/))
                return 'D62-PDC';
            if (testCase.menages._.depcom[currentPeriod].match(/^75/))
                return 'D75-PARIS';
            if (testCase.menages._.depcom[currentPeriod].match(/^76/))
                return 'D76-SEINE_MARITIME';
            if (testCase.menages._.depcom[currentPeriod].match(/^83/))
                return 'D83-VAR';
            if (testCase.menages._.depcom[currentPeriod].match(/^92/))
                return 'D92-HAUTS_DE_SEINE';
            if (testCase.menages._.depcom[currentPeriod].match(/^93/))
                return 'D93-SSD';
            if (_.includes(lyonMetropoleInseeCodes, testCase.menages._.depcom[currentPeriod]))
                return 'M69-LYON';
        }
        return undefined;
    }
    return {
        determineCustomizationId: determineCustomizationId,
    };
});

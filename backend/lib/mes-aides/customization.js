var { includes } = require('lodash/includes');
var lyonMetropoleInseeCodes = require('./lyon-metropole-insee-codes');

function determineCustomizationId(testCase, currentPeriod) {
    if (testCase.menages &&
        testCase.menages._ &&
        testCase.menages._.depcom &&
        testCase.menages._.depcom[currentPeriod]) {
        if (testCase.menages._.depcom[currentPeriod].match(/^05/))
            return 'D05-HAUTES_ALPES';
        if (testCase.menages._.depcom[currentPeriod].match(/^06/))
            return 'D06-ALPES_MARITIMES';
        if (testCase.menages._.depcom[currentPeriod].match(/^13/))
            return 'D13-BDR';
        if (testCase.menages._.depcom[currentPeriod].match(/^14/))
            return 'D14-CALVADOS';
        if (testCase.menages._.depcom[currentPeriod].match(/^28/))
            return 'D28-EURE_ET_LOIR';
        if (testCase.menages._.depcom[currentPeriod].match(/^29/))
            return 'D29-FINISTERE';
        if (testCase.menages._.depcom[currentPeriod].match(/^31/))
            return 'D31-HAUTE_GARONNE';
        if (testCase.menages._.depcom[currentPeriod].match(/^33/))
            return 'D33-GIRONDE';
        if (testCase.menages._.depcom[currentPeriod].match(/^34/))
            return 'D34-HERAULT';
        if (testCase.menages._.depcom[currentPeriod].match(/^35/))
            return 'D35-ILLE_ET_VILAINE';
        if (testCase.menages._.depcom[currentPeriod].match(/^38/))
            return 'D38-ISERE';
        if (testCase.menages._.depcom[currentPeriod].match(/^42/))
            return 'D42-LOIRE';
        if (testCase.menages._.depcom[currentPeriod].match(/^44/))
            return 'D44-LOIRE_ATLANTIQUE';
        // Remove this when Loiret teleservice is live
        if (testCase.menages._.depcom[currentPeriod].match(/^45122/))
            return 'D45-DAMPIERRE-EN-BURLY';
        if (testCase.menages._.depcom[currentPeriod].match(/^57/))
            return 'D57-MOSELLE';
        if (testCase.menages._.depcom[currentPeriod].match(/^59/))
            return 'D59-NORD';
        if (testCase.menages._.depcom[currentPeriod].match(/^62/))
            return 'D62-PDC';
        if (testCase.menages._.depcom[currentPeriod].match(/^64/))
            return 'D64-PYRENEES_ATLANTIQUES';
        if (testCase.menages._.depcom[currentPeriod].match(/^67/))
            return 'D67-BAS_RHIN';
        if (testCase.menages._.depcom[currentPeriod].match(/^75/))
            return 'D75-PARIS';
        if (testCase.menages._.depcom[currentPeriod].match(/^76/))
            return 'D76-SEINE_MARITIME';
        if (testCase.menages._.depcom[currentPeriod].match(/^77/))
            return 'D77-SEINE_ET_MARNE';
        if (testCase.menages._.depcom[currentPeriod].match(/^83/))
            return 'D83-VAR';
        if (testCase.menages._.depcom[currentPeriod].match(/^92/))
            return 'D92-HAUTS_DE_SEINE';
        if (testCase.menages._.depcom[currentPeriod].match(/^93/))
            return 'D93-SSD';
        if (testCase.menages._.depcom[currentPeriod].match(/^94/))
            return 'D94-VAL_DE_MARNE';
        if (includes(lyonMetropoleInseeCodes, testCase.menages._.depcom[currentPeriod]))
            return 'M69-LYON';
    }

    return undefined;
}

module.exports = determineCustomizationId;

'use strict';

angular.module('ddsApp').service('LogementService', function() {

    function getStatutOccupationLogement(logement) {
        var statusOccupationMap = {
            'proprietaireprimoaccedant': 1,
            'proprietaire': 2,
            'locatairenonmeuble': 4,
            'locatairemeublehotel': 5,
            'heberge': 6,
            'locatairefoyer': 7,
            'sansDomicile' : 8
        };
        var statusOccupationId = logement.type;
        if (logement.type == 'proprietaire' && logement.primoAccedant) {
            statusOccupationId = 'proprietaireprimoaccedant';
        } else if (logement.type == 'locataire' && logement.locationType) {
            statusOccupationId += logement.locationType;
        }
        return statusOccupationMap[statusOccupationId];
    }

    function getBaseLogement(statusOccupationId) {
        var baseLogementMap = {
            1: { type: 'proprietaire', primoAccedant: true },
            2: { type: 'proprietaire' },
            4: { type: 'locataire', locationType: 'nonmeuble' },
            5: { type: 'locataire', locationType: 'meublehotel' },
            6: { type: 'heberge' },
            7: { type: 'locataire', locationType: 'foyer' },
            8: { type: 'sansDomicile' },
        };
        return (statusOccupationId && baseLogementMap[statusOccupationId]) || {};
    }

    return {
        statutOccupationLogement: {
            getBaseLogement: getBaseLogement,
            getValue: getStatutOccupationLogement,
        },
    };
});

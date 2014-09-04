'use strict';

angular.module('ddsApp').constant('logementTypes', [
    {
        id: 'locataire',
        label: 'locataire',
        helpText: 'Locataire ou sous-locataire',
        locationTypes: [
            {
                id: 'nonmeuble',
                label: 'non meublé'
            },
            {
                id: 'meublehotel',
                label: 'meublé / hôtel'
            },
            {
                id: 'hlm',
                label: 'HLM'
            }
        ]
    },
    {
        id: 'proprietaire',
        label: 'propriétaire'
    },
    {
        id: 'gratuit',
        label: 'occupant à titre gratuit'
    },
    {
        id: 'payant',
        label: 'occupant à titre onéreux',
        helpText: 'Camping, caravane, hébergement payant...'
    }
]);

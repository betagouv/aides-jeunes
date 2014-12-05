'use strict';

angular.module('ddsCommon').constant('logementTypes', [
    {
        id: 'locataire',
        label: 'locataire'
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
        label: 'occupant à titre onéreux'
    }
]);

angular.module('ddsCommon').constant('locationTypes', [
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
]);

angular.module('ddsCommon').constant('loyerLabels', {
    'payant': 'Votre loyer',
    'locataire': 'Votre loyer',
    'proprietaire': 'Votre mensualité d’emprunt'
});

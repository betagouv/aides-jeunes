'use strict';

angular.module('ddsApp').constant('logementTypes', [
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

angular.module('ddsApp').constant('locationTypes', [
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

angular.module('ddsApp').constant('loyerLabels', {
    'payant': 'Votre loyer',
    'locataire': 'Votre loyer (hors charges)',
    'colocataire': 'Voter part du loyer (hors charges)',
    'proprietaire': 'Votre mensualité d’emprunt'
});

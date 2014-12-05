'use strict';

angular.module('ddsCommon').constant('logementTypes', [
    {
        id: 'locataire',
        label: 'locataire'
    },
    {
        id: 'proprietaire',
        label: 'propriétaire / en location-accession'
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
        label: 'Foyer (résidence universitaire, maison de retraite, foyer de jeune travailleur, résidence sociale...)'
    }
]);

angular.module('ddsCommon').constant('loyerLabels', {
    'payant': 'Votre loyer',
    'locataire': 'Votre loyer',
    'proprietaire': 'Votre mensualité totale d’emprunt'
});

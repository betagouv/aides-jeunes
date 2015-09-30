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
        id: 'heberge',
        label: 'hébergé'
    },
    {
        id: 'sansDomicile',
        label: 'sans domicile stable'
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
        id: 'foyer',
        label: 'Foyer (résidence universitaire, maison de retraite, foyer de jeune travailleur, résidence sociale…)'
    }
]);

angular.module('ddsCommon').constant('loyerLabels', {
    'locataire': 'Votre loyer',
    'proprietaire': 'Montant des mensualités'
});

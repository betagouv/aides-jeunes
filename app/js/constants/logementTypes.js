'use strict';

angular.module('ddsCommon').constant('logementTypes', [
    {
        id: 'locataire',
        label: 'locataire',
        hint: 'Figurant sur le contrat de location ou de résidence.'
    },
    {
        id: 'proprietaire',
        label: 'propriétaire',
        hint: 'Y compris en location-accession.'
    },
    {
        id: 'heberge',
        label: 'hébergé',
        hint: 'Chez un particulier.'
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

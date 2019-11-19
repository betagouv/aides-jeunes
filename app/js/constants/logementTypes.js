'use strict';

angular.module('ddsCommon').constant('logementTypes', [
    {
        id: 'locataire',
        label: 'locataire',
        hint: 'Figurant sur le bail ou en foyer ou en résidence'
    },
    {
        id: 'proprietaire',
        label: 'propriétaire',
        hint: 'Ou en location-accession'
    },
    {
        id: 'heberge',
        label: 'hébergé',
        hint: 'Chez un particulier ou en logement de fonction'
    },
    {
        id: 'sansDomicile',
        label: 'sans domicile stable',
        hint: 'Ou domiciliation administrative'
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

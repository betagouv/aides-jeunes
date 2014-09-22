'use strict';

angular.module('ddsApp').constant('ressourceTypes', [
    {
        id: 'revenusSalarie',
        label: 'Salaires',
        category: 'revenusActivite'
    },
    {
        id: 'revenusNonSalarie',
        label: 'Revenus non salariés',
        category: 'revenusActivite'
    },
    {
        id: 'revenusAutoEntrepreneur',
        label: 'Revenus auto-entrepreneur',
        category: 'revenusActivite'
    },
    {
        id: 'revenusStage',
        label: 'Revenus de stage de formation professionnelle',
        category: 'revenusActivite'
    },
    {
        id: 'allocationsChomage',
        label: 'Allocation chômage',
        category: 'allocations'
    },
    {
        id: 'allocationLogement',
        label: 'Aide au logement',
        category: 'allocations'
    },
    {
        id: 'rsa',
        label: 'Revenu de solidarité active (RSA)',
        category: 'allocations'
    },
    {
        id: 'asf',
        label: 'Allocation de soutien familial (ASF)',
        category: 'allocations'
    },
    {
        id: 'aspa',
        label: 'Allocation de solidarité aux personnes âgées (ASPA)',
        category: 'allocations'
    },
    {
        id: 'ass',
        label: 'Allocation de solidarité spécifique (ASS)',
        category: 'allocations'
    },
    {
        id: 'aah',
        label: 'Allocation adulte handicapé',
        category: 'allocations'
    },
    {
        id: 'indJourMaternite',
        label: 'Indemnités de maternité, paternité, adoption',
        category: 'indemnites'
    },
    {
        id: 'indJourMaladie',
        label: 'Indemnités maladie',
        category: 'indemnites'
    },
    {
        id: 'indJourMaladieProf',
        label: 'Indemnités maladie professionnelle',
        category: 'indemnites'
    },
    {
        id: 'indJourAccidentDuTravail',
        label: 'Indemnités accident du travail',
        category: 'indemnites'
    },
    {
        id: 'indChomagePartiel',
        label: 'Indemnités de chômage partiel',
        category: 'indemnites'
    },
    {
        id: 'pensionsAlimentaires',
        label: 'Pensions alimentaires',
        category: 'pensions'
    },
    {
        id: 'pensionsRetraitesRentes',
        label: 'Retraites (y compris reversion), rentes',
        category: 'pensions'
    },
    {
        id: 'pensionsInvalidite',
        label: 'Pensions d\'invalidité',
        category: 'pensions'
    },
    {
        id: 'bourseEnseignementSup',
        label: 'Bourses de l\'enseignement supérieur',
        category: 'autre'
    }
]);

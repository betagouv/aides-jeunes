'use strict';

angular.module('ddsApp').constant('situationsFamiliales', [
    {
        value: 'mariage',
        label: 'Marié(e)',
        isSituationCouple: true
    },
    {
        value: 'pacs',
        label: 'Pacsé(e)',
        isSituationCouple: true
    },
    {
        value: 'relation_libre',
        label: 'En relation libre',
        isSituationCouple: true
    },
    {
        value: 'celibataire',
        label: 'Célibataire depuis toujours'
    },
    {
        value: 'divorce',
        label: 'Divorcé'
    },
    {
        value: 'veuf',
        label: 'Veuf'
    },
    {
        value: 'separe',
        label: 'Séparé de fait'
    },
    {
        value: 'pacs_rompu',
        label: 'Pacs rompu'
    },
    {
        value: 'concubinage_rompu',
        label: 'Concubinage rompu'
    }
]);

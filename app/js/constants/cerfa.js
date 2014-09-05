'use strict';

angular.module('ddsApp').constant('cerfaForms', [
    {
        droitId: 'cmu_c',
        forms: [
            {
                id: 'cmuc_demande',
                label: 'Formulaire de demande'
            },
            {
                id: 'cmuc_choix_organisme_demandeur',
                label: 'Formulaire de choix de l\'organisme (demandeur)'
            },
            {
                id: 'cmuc_choix_organisme_non_demandeur',
                label: 'Formulaire de choix de l\'organisme (autres membres du foyer)',
            }
        ]
    }
]);

'use strict';

angular.module('ddsCommon').constant('situationsFamiliales', [
    {
        value: 'Marié',  // Enum value 1 in OpenFisca
        label: 'Marié(e)',
    },
    {
        value: 'Pacsé',  // Enum value 5 in OpenFisca
        label: 'Pacsé(e)',
    },
    {
        value: 'Célibataire',  // Enum value 2 in OpenFisca
        label: 'En union libre',
    }
]);

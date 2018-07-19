(function() {

    'use strict';

    var situationsFamiliales = [
        {
            value: 'marie',  // Enum value 1 in OpenFisca
            label: 'Marié·e',
        },
        {
            value: 'pacse',  // Enum value 5 in OpenFisca
            label: 'Pacsé·e',
        },
        {
            value: 'celibataire',  // Enum value 2 in OpenFisca
            label: 'En union libre',
        }
    ];

    /* Export either through Angular loader or CommonJS */
    if (typeof global != 'undefined') {  // we're in Node
        module.exports = situationsFamiliales;
    } else {  // we're in the browser
        angular.module('ddsCommon').constant('situationsFamiliales', situationsFamiliales);
    }

})();

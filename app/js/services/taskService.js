'use strict';

angular.module('ddsBackend').factory('TaskService', function($http) {
    return {
        labels: {
            'nir_validation': 'Validation du code NIR',
            'revenus_dgfip': 'Vérification des revenus'
        }
    };
});

'use strict';

angular.module('ddsApp').service('MappingService', function($q, $http) {
    function buildOpenFiscaRequest(situation) {
        return $q(function(resolve, reject) {
            return $http.get('/api/situations/' + situation._id + '/openfisca-request').then(function(simulation) {
                var request = {
                    intermediate_variables: true,
                    labels: true,
                    scenarios: [ simulation.data.scenarios[0] ],
                    variables: simulation.data.variables,
                };

                resolve(request);
            }, reject);
        });
    }

    return {
        buildOpenFiscaRequest: buildOpenFiscaRequest,
    };
});

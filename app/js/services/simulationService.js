'use strict';

angular.module('ddsApp').service('SimulationService', function($http, droitsDescription) {
    function makeObjectFilter(test) {
        return function(source) {
            var result = {};

            _.forEach(source, function(value, key) {
                if (test(value, key)) {
                    result[key] = value;
                }
            });

            return result;
        };
    }

    var filterUnhandled = makeObjectFilter(function(value, key) {
        return droitsDescription[key];
    });

    /* jshint unused: false */
    var filterIneligible = makeObjectFilter(function(value, key) {
        return value;
    });

    function describe(droits) {
        return _.mapValues(droits, function(montant, key) {
            var result = _.clone(droitsDescription[key]);
            result.montant = montant;
            return result;
        });
    }

    return {
        simulate: function(situation) {
            return $http.get('/api/situations/' + situation._id + '/simulation').then(function(response) {
                return describe(filterIneligible(filterUnhandled(response.data)));
            });
        },
        filterUnhandled: filterUnhandled,
        filterIneligible: filterIneligible,
        describe: describe,
        complement: function(droits) {
            var result = _.clone(droitsDescription);

            _.forEach(droits, function(montant, key) {
                delete result[key];
            });

            return result;
        }
    };
});

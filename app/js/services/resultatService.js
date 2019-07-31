'use strict';

var computeAides = require('../../../backend/lib/mes-aides').computeAides;
var round = require('../../../backend/lib/mes-aides').round;

angular.module('ddsApp').service('ResultatService', function($http, $rootScope) {

    var _loading = false;

    function simulate(situation, showPrivate) {
        setLoading(true);
        return $http.get('api/situations/' + situation._id + '/openfisca-response')
            .then(function(OpenfiscaResponse) {
                return OpenfiscaResponse.data;
            }).then(function(openfiscaResponse) {
                return computeAides(situation, openfiscaResponse, showPrivate);
            }).finally(function() {
                setLoading(false);
            });
    }

    function setLoading(loading) {
        if (loading !== _loading) {
            $rootScope.$broadcast('resultat:loading:changed', loading);
        }
        _loading = loading;
    }

    function isLoading() {
        return _loading;
    }

    return {
        _computeAides: computeAides,  // exposed for testing only
        round: round, // exposed for testing only
        simulate: simulate,
        isLoading: isLoading
    };
});

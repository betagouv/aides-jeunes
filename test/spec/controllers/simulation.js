'use strict';

/* global _ */

describe('Controller: SimulationCtrl', function() {

    var controller, scope, q, SimulationService;

    beforeEach(function() {
        module('ddsApp');
        inject(function($controller, $rootScope, $q, _SimulationService_) {
            controller = $controller;
            q = $q;
            SimulationService = _SimulationService_;
            scope = $rootScope.$new();
            scope.situation = { dateDeValeur: '2013-04-10' };
        });
    });

    it('round() should round to the nearest ten', function() {
        // given
        var values = [100, 57, 54, 34.5];
        controller('SimulationCtrl', { $scope: scope });

        // when
        var results = _.map(values, scope.round);

        // then
        expect(results).toEqual([100, 60, 50, 30]);
    });
});

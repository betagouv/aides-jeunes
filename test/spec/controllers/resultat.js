'use strict';

/* global _ */

describe('Controller: ResultatCtrl', function() {

    var controller, scope, q, ResultatService;

    beforeEach(function() {
        module('ddsApp');
        inject(function($controller, $rootScope, $q, _ResultatService_) {
            controller = $controller;
            q = $q;
            ResultatService = _ResultatService_;
            scope = $rootScope.$new();
            scope.situation = { dateDeValeur: '2013-04-10' };
        });
    });

    it('round() should round to the nearest ten', function() {
        // given
        var values = [100, 57, 54, 34.5];
        controller('ResultatCtrl', { $scope: scope });

        // when
        var results = _.map(values, scope.round);

        // then
        expect(results).toEqual([100, 60, 50, 30]);
    });
});

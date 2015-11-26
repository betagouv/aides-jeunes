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

    describe('round', function() {
        describe('euros', function() {
            it('should give nearest ten', function() {
                var values = [{ montant: 100 }, { montant: 57 }, { montant: 54 }];
                controller('ResultatCtrl', { $scope: scope });

                // when
                var results = _.map(values, scope.round);

                // then
                expect(results).toEqual([100, 60, 50]);
            });
        });
        describe('percentage', function() {
            it('should give nearest unit', function() {
                var values = [{ montant: 74.11, unit: '%' }, { montant: 26.81, unit: '%' }];
                controller('ResultatCtrl', { $scope: scope });

                // when
                var results = _.map(values, scope.round);

                // then
                expect(results).toEqual([74, 27]);
            });
        });
    });
});

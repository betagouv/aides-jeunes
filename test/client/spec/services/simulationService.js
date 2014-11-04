'use strict';

describe('Service: simulationService', function () {

    beforeEach(function() {
        module('ddsApp');
    });

    describe('function createDroitsFromApiResult', function() {
        var service;

        beforeEach(function() {
            inject(function(SimulationService) {
                service = SimulationService;
            });
        });

        it('should return an empty array if api result is empty', function() {
            // given
            var apiResult = {};

            // when
            var droits = service.createDroitsFromApiResult(apiResult);

            // then
            expect(droits.length).toBe(0);
        });

        it('should return an array with each droit from the api result', function() {
            // given
            var apiResult = {'cmu_c': true, acs: 150};

            // when
            var droits = service.createDroitsFromApiResult(apiResult);

            // then
            expect(droits.length).toBe(2);
            expect(droits[0].description).toBeDefined();
        });
    });

    describe('function getDroitsNonEligibles', function() {
        it('should return droits that are not in the given list of droits eligibles', function() {
            // given
            var service;
            module(function($provide) {
                $provide.constant('droitsDescription', [{ id: 'test' }, { id: 'test2' }]);
            });
            inject(function(SimulationService) {
                service = SimulationService;
            });

            var droitsEligibles = [{description: {id: 'test'}}];

            // when
            var result = service.getDroitsNonEligibles(droitsEligibles);

            // then
            expect(result).toEqual([{id: 'test2'}]);
        });
    });
});

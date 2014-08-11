'use strict';

describe('Service: simulationService', function () {

    var service;

    beforeEach(function() {
        module('ddsApp');
        inject(function(SimulationService) {
            service = SimulationService;
        });
    });

    describe('function createDroitsFromApiResult', function() {
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
});

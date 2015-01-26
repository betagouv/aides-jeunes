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

        it('should return no droits if api result is empty', function() {
            // given
            var apiResult = {};

            // when
            var result = service.createDroitsFromApiResult(apiResult);

            // then
            expect(result.droits.length).toBe(0);
        });

        it('should return arrays with each droit from the api result, separated by the criteria base ressource n-2', function() {
            // given
            var apiResult = { cmu_c: true, acs: 150, aide_logement: 400 };

            // when
            var result = service.createDroitsFromApiResult(apiResult);

            // then
            expect(result.droits.length).toBe(3);
            expect(result.droits[0].description.id).toBe('cmu_c');
            expect(result.droits[2].description.id).toBe('aide_logement');
            expect(result.droits[2].isBaseRessourcesYearMoins2).toBe(true);
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

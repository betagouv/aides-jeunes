'use strict';

describe('Service: SimulationService', function () {

    var service, httpBackend;

    describe('function createDroitsFromApiResult', function() {
        beforeEach(function() {
            module('ddsApp');
            inject(function(SimulationService, $httpBackend) {
                service = SimulationService;
                httpBackend = $httpBackend;
            });
        });

        it('should return no droits if api result is empty', function() {
            // given
            var apiResult = {};

            // when
            var result = service.createDroitsFromApiResult(apiResult, { logement: {} });

            // then
            expect(result.droits.length).toBe(0);
        });

        it('should return arrays with each droit from the api result, separated by the criteria base ressource n-2', function() {
            // given
            var apiResult = { cmu_c: true, acs: 150, aide_logement: 400 };

            // when
            var result = service.createDroitsFromApiResult(apiResult, { logement: {} });

            // then
            expect(result.droits.length).toBe(3);
            expect(result.droits[0].description.id).toBe('cmu_c');
            expect(result.droits[2].description.id).toBe('aide_logement');
            expect(result.droits[2].isBaseRessourcesYearMoins2).toBe(true);
        });

        it('doit forcer le résultat des AL avec un montant null si le demandeur est propriétaire ou dans un foyer', function() {
            // given
            var logements = [
                { type: 'proprietaire' },
                { type: 'locataire', locationType: 'foyer' }
            ];
            logements.forEach(function(logement) {
                var situation = { _id: 'foo', logement: logement };

                // when
                var result = service.createDroitsFromApiResult({ aide_logement: 0 }, situation);

                // then
                expect(result.droits[0].montant).toBe(null);
            });
        });
    });

    describe('function getDroitsNonEligibles', function() {
        it('should return droits that are not in the given list of droits eligibles', function() {
            // given
            module('ddsApp');
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

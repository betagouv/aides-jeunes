'use strict';

describe('SimulationService', function () {

    // var service, httpBackend;

    // describe('filters', function() {
    //     beforeEach(function() {
    //         module('ddsApp');
    //         inject(function(SimulationService, $httpBackend) {
    //             service = SimulationService;
    //             httpBackend = $httpBackend;
    //         });
    //     });

    //     describe('filterUnhandled', function() {
    //         it('should filter prestations that are not described', function() {
    //             expect(service.filterUnhandled({ test: 0 }).test).toBe(undefined);
    //         });

    //         it('should pass prestations that are described', function() {
    //             expect(service.filterUnhandled({ acs: 12 }).acs).toBe(12);
    //         });
    //     });

    //     describe('filterIneligible', function() {
    //         it('should filter prestations with 0 amounts', function() {
    //             expect(service.filterIneligible({ acs: 0 }).acs).toBe(undefined);
    //         });

    //         it('should pass prestations with amounts > 0', function() {
    //             expect(service.filterIneligible({ acs: 12 }).acs).toBe(12);
    //         });
    //     });

    //     describe('describe', function() {
    //         it('should merge descriptions and amounts', function() {
    //             var actual = service.describe({ acs: 150 });

    //             expect(actual.acs.id).toBe('acs');
    //             expect(actual.acs.montant).toBe(150);
    //         });
    //     });
    // });

    // describe('complement', function() {
    //     var DROITS_DESCRIPTION = { acs: { id: 'acs' }, apl: { id: 'apl' }};

    //     beforeEach(function() {
    //         module('ddsApp');
    //         module(function($provide) {
    //             $provide.constant('droitsDescription', DROITS_DESCRIPTION);
    //         });
    //         inject(function(SimulationService) {
    //             service = SimulationService;
    //         });
    //     });

    //     it('should return the complement from droitsDescription with the given droits', function() {
    //         var actual = service.complement({ acs: { montant: 12 } });

    //         expect(actual.acs).toBe(undefined);
    //         expect(actual.apl.id).toBe('apl');
    //     });

    //     it('should not change droitsDescription', function() {
    //         expect(DROITS_DESCRIPTION.acs.id).toBe('acs');
    //         expect(DROITS_DESCRIPTION.apl.id).toBe('apl');
    //     });
    // });
});

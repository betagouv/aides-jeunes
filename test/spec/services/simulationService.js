'use strict';

describe('SimulationService', function () {
    describe('sortDroits', function() {
        var DROITS_DESCRIPTION = { acs: { id: 'acs' }, apl: { id: 'apl' }};
        var service;

        beforeEach(function() {
            module('ddsApp');
            module(function($provide) {
                $provide.constant('droitsDescription', DROITS_DESCRIPTION);
            });
            inject(function(SimulationService) {
                service = SimulationService;
            });
        });

        it('should sort eligible and non eligible droits', function() {
            var openfiscaResult = { acs: 10 };
            var droits = service.sortDroits(openfiscaResult);
            expect(droits.droitsEligibles).toEqual({ acs: { id: 'acs', montant: 10 } });
            expect(droits.droitsNonEligibles).toEqual({ apl: { id: 'apl' } });
            expect(droits.droitsInjectes).toEqual({});
        });

        it('should sort eligible and injected droits', function() {
            var openfiscaResult = { acs: 10, apl: null };
            var droits = service.sortDroits(openfiscaResult);
            expect(droits.droitsEligibles).toEqual({ acs: { id: 'acs', montant: 10 } });
            expect(droits.droitsNonEligibles).toEqual({});
            expect(droits.droitsInjectes).toEqual({ apl: { id: 'apl' } });
        });
    });
});

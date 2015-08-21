'use strict';

describe('ResultatService', function () {
    describe('sortDroits', function() {
        var DROITS_DESCRIPTION = {
            acs: { id: 'acs' },
            apl: { id: 'apl' },
            ass: { id: 'ass'}
        };
        var service, droits, openfiscaResult;

        beforeEach(function() {
            module('ddsApp');
            module(function($provide) {
                $provide.constant('droitsDescription', DROITS_DESCRIPTION);
            });
            inject(function(ResultatService) {
                service = ResultatService;
            });
            openfiscaResult = { acs: 10, apl: null };
            droits = service.sortDroits(openfiscaResult);
        });

        it('should extract eligibles droits from openfisca result', function() {
            expect(droits.droitsEligibles).toEqual({ acs: { id: 'acs', montant: 10 } });
        });

        it('should extract injected droits', function() {
            expect(droits.droitsInjectes).toEqual({ apl: { id: 'apl' } });
        });

        it('should extract non eligibles droits', function() {
            expect(droits.droitsNonEligibles).toEqual({ ass: { id: 'ass' } });
        });
    });
});

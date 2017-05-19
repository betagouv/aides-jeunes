'use strict';

describe('ResultatService', function () {
    describe('processOpenfiscaResult', function() {
        var DROITS_DESCRIPTION = {
            prestationsNationales : {
                caf: {
                    label: 'CAF',
                    imgSrc: 'img',
                    prestations: {
                        acs: { shortLabel: 'ACS' },
                        apl: { shortLabel: 'APL' },
                        ass: { shortLabel: 'ASS' },
                        aah: { shortLabel: 'AAH' },
                        rsa: { shortLabel: 'RSA' },
                        cmu_c: { shortLabel: 'CMU C' },
                    },
                },
            },
            partenairesLocaux: {},
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

            openfiscaResult = {
                params: {
                    scenarios: [{
                        period: 'month:2014-11',
                        test_case: {
                            familles: [{
                                apl: {
                                    '2014-11': 1
                                }
                            }],
                            individus: [{
                                aah: {
                                    '2014-11':1
                                }
                            }]
                        }
                    }]
                },
                value: [{
                    familles: [{
                        rsa_non_calculable: {
                            '2014-11': 'error'
                        }
                    }],
                    individus: [{
                        acs: {
                            '2014-11':1
                        },
                        cmu_c: {
                            '2014-11': false
                        }
                    }]
                }]
            };
            droits = service.processOpenfiscaResult(openfiscaResult);
        });

        it('should extract eligibles droits from openfisca result', function() {
            expect(droits.droitsEligibles.prestationsNationales.acs).toBeTruthy();
            expect(droits.droitsEligibles.prestationsNationales.acs.provider.label).toEqual('CAF');
        });

        it('should extract reason of uncomputability', function() {
            expect(droits.droitsEligibles.prestationsNationales.rsa.montant).toEqual('error');
        });

        it('should extract injected droits', function() {
            expect(droits.droitsInjectes).toEqual([{ shortLabel: 'APL' }, { shortLabel: 'AAH' }]);
        });
    });
});

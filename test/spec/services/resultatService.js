'use strict';

describe('ResultatService', function () {
    describe('sortDroits', function() {
        var DROITS_DESCRIPTION = {
            prestationsNationales : {
                caf: {
                    imgSrc: 'img',
                    prestations: {
                        acs: { shortLabel: 'ACS' },
                        apl: { shortLabel: 'APL' },
                        ass: { shortLabel: 'ASS' },
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
            openfiscaResult = { calculatedPrestations: { acs: 10 }, injectedPrestations: ['apl'] };
            droits = service.processOpenfiscaResult(openfiscaResult);
        });

        it('should extract eligibles droits from openfisca result', function() {
            expect(droits.droitsEligibles.prestationsNationales).toEqual({ acs: { shortLabel: 'ACS', montant: 10, imgSrc: 'img' } });
        });

        it('should extract injected droits', function() {
            expect(droits.droitsInjectes).toEqual([{ shortLabel: 'APL' }]);
        });

        describe('Preprocessing', function() {
            var INDIVIDU, OPENFISCA_FAMILLE, OPENFISCA_RESPONSE, SITUATION, actual;
            OPENFISCA_FAMILLE = {
                id: 0,
                aspa: {
                    '2014-11': 1.199
                },
                asi: {
                    '2014-11': 1
                },
                acs: {
                    '2014-11': 1
                },
                cmu_c: {
                    '2014-11': false
                },
                apl: {
                    '2014-11': 1
                },
                als: {
                    '2014-11': 1
                },
                alf: {
                    '2014-11': 1
                },
                aide_logement: {
                    '2014-11': 1
                },
                aide_logement_non_calculable: {
                    '2014-11': ''
                },
                af: {
                    '2014-11': 1
                },
                rsa: {
                    '2014-11': 1
                },
                rsa_non_calculable: {
                    '2014-11': ''
                },
                asf: {
                    '2014-11': 1
                },
                cf: {
                    '2014-11': 1
                },
                ass: {
                    '2014-11': 1
                },
                paje_base: {
                    '2014-11': 1
                },
                bourse_college: {
                    '2014-11': 1
                },
                bourse_lycee: {
                    '2014-11': 1
                },
                paris_logement_familles: {
                    '2014-11': 1
                },
                paris_forfait_famille: {
                    '2014-11': 1
                },
                  paris_logement_psol: {
                    '2014-11': 1
                },
                paris_logement: {
                    '2014-11': 1
                },
                paris_logement_plfm: {
                    '2014-11': 1
                },
                paris_logement_aspeh: {
                    '2014-11': 1
                },
                paris_energie_famille: {
                    '2014-11': 1
                },
                paris_complement_sante: {
                    '2014-11': 1
                },
                adpa: {
                    '2014-11': 1
                },
                rennes_metropole_transport: {
                    '2014-11': 1
                },
                ppa: {
                    '2014-11': 1
                }
            };
            INDIVIDU = {
                aah: {
                    '2014-11': 9
                },
                aah_non_calculable: {
                    '2014-11': ''
                },
                specificSituations: []
            };
            OPENFISCA_RESPONSE = {
                value: [
                {
                    familles: [OPENFISCA_FAMILLE],
                    individus: [INDIVIDU]
                }
            ]};
            SITUATION = {
                dateDeValeur: new Date('2014-11'),
                individus: [
                {
                    ressources: []
                }
            ]};

            beforeEach(function() {
                actual = service.preprocessOpenfiscaResult(SITUATION, OPENFISCA_RESPONSE);
            });

            it('should extract individual prestations', function() {
                expect(actual.calculatedPrestations.aah).toEqual(9);
            });

            describe('of an amount', function() {
                it('should round', function() {
                    expect(actual.calculatedPrestations.aspa).toEqual(1.2);
                });
            });

            describe('of a boolean', function() {
                it('should be a pass-through', function() {
                    expect(actual.calculatedPrestations.cmu_c).toEqual(false);
                });
            });

            describe('of an uncomputable value', function() {
                var REASON, familleWithUncomputableRSA, openfiscaResponseWithUncomputableRSA;
                REASON = 'tns';
                familleWithUncomputableRSA = _.clone(OPENFISCA_FAMILLE);
                familleWithUncomputableRSA.rsa_non_calculable = {
                    '2014-11': REASON
                };

                openfiscaResponseWithUncomputableRSA = {
                    value: [
                      {
                        familles: [familleWithUncomputableRSA],
                        individus: []
                      }
                ]};

                it('should set the value to the identifier of the uncomputability', function() {
                    var res = service.preprocessOpenfiscaResult(SITUATION, openfiscaResponseWithUncomputableRSA);
                    expect(res.calculatedPrestations.rsa).toEqual(REASON);
                });
            });
        });
    });
});

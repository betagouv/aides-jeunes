'use strict';

describe('ResultatService', function () {
    var service, droits, situation, openfiscaResult, DROITS_DESCRIPTION;

    beforeEach(function() {
        module('ddsApp');
        inject(function(ResultatService, droitsDescription)
        {
            service = ResultatService;
            DROITS_DESCRIPTION = droitsDescription;
        });

        situation = {
            dateDeValeur: '2014-11-01',
            individus: [{
                aah: {
                    '2014-11': 100
                },
                aide_logement: {
                    '2014-11': 100
                }
            },{
                ppa: {
                    '2014-11': 100
                }
            }]
        };

        openfiscaResult = {
            familles: {
                _: {
                    rsa_non_calculable: {
                        '2014-11': 'error'
                    },
                    paris_logement_familles: {
                        '2014-11': 10
                    }
                }
            },
            menages: {
                _: {
                    personne_de_reference: ['demandeur'],
                    depcom: {
                        '2014-11': '00000'
                    },
                }
            },
            individus: {
                demandeur: {
                    acs: {
                        '2014-11':100.25
                    },
                    cmu_c: {
                        '2014-11': false
                    }
                }
            }
        };
    });

    describe('_computeAides injected values', function() {
        beforeEach(function() {
            droits = service._computeAides(situation, openfiscaResult);
        });

        it('should extract injected droits', function() {
            expect(droits.droitsInjectes).toContain(DROITS_DESCRIPTION.prestationsNationales.caf.prestations.aah);
            expect(droits.droitsInjectes).toContain(DROITS_DESCRIPTION.prestationsNationales.caf.prestations.aide_logement);
            expect(droits.droitsInjectes).toContain(DROITS_DESCRIPTION.prestationsNationales.caf.prestations.ppa);
        });

        it('should not have injected droits duplicates', function() {
            expect(droits.droitsInjectes.filter(function(d) { return d.label == "Allocation aux adultes handicapés"; }).length).toEqual(1);
        });
    });

    describe('_computeAides of numeric value', function() {
        beforeEach(function() {
            droits = service._computeAides(situation, openfiscaResult);
        });

        it('should extract eligibles droits from openfisca result', function() {
            expect(droits.droitsEligibles.prestationsNationales.acs).toBeTruthy();
            expect(droits.droitsEligibles.prestationsNationales.acs.montant).toEqual(100);
            expect(droits.droitsEligibles.prestationsNationales.acs.provider.label).toEqual('Assurance maladie');

            expect(droits.droitsEligibles.partenairesLocaux[0].label).toEqual('Ville de Paris');
            expect(droits.droitsEligibles.partenairesLocaux[0].prestations.paris_logement_familles).toBeTruthy();
            expect(droits.droitsEligibles.partenairesLocaux[0].prestations.paris_logement_familles.montant).toEqual(10);
        });
    });

    describe('_computeAides of true boolean values', function() {
        beforeEach(function() {
            openfiscaResult.individus.demandeur.cmu_c['2014-11'] = true;
            droits = service._computeAides(situation, openfiscaResult);
        });

        it('should extract eligibles droits from openfisca result', function() {
            expect(droits.droitsEligibles.prestationsNationales.cmu_c).toBeTruthy();
            expect(droits.droitsEligibles.prestationsNationales.cmu_c.montant).toBeTruthy();
        });
    });

    describe('_computeAides uncomputability highlighted', function() {
        beforeEach(function() {
            droits = service._computeAides(situation, openfiscaResult);
        });

        it('should extract reason of uncomputability', function() {
            expect(droits.droitsEligibles.prestationsNationales.rsa.montant).toEqual('error');
        });
    });

    describe('_computeAides extraction of local partenaire without prestation', function() {
        beforeEach(function() {
            droits = service._computeAides(situation, openfiscaResult);
        });

        it('should exclude local partenaire without prestation', function() {
            expect(droits.droitsEligibles.partenairesLocaux.filter(function(p) { return p.label == "Rennes Métropole"; }).length).toBeFalsy();
        });
    });
});

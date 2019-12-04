import { computeAides } from '@/../backend/lib/mes-aides'
import droitsDescription from '@/../app/js/constants/benefits'

describe('computeAides', function () {
    var droits, situation, openfiscaResult

    beforeEach(function() {
        situation = {
            dateDeValeur: '2014-11-01',
            demandeur: {
                aah: {
                    '2014-11': 100
                },
                aide_logement: {
                    '2014-11': 100
                }
            },
            conjoint: {
                ppa: {
                    '2014-11': 100
                }
            }
        }

        openfiscaResult = {
            familles: {
                _: {
                    rsa_non_calculable: {
                        '2014-11': 'error'
                    },
                    paris_logement_familles: {
                        '2014-11': 10
                    },
                    alfortville_noel_enfants: {
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
                    css_participation_forfaitaire: {
                        '2014-11': 10
                    },
                    logement_social_eligible: {
                        '2014-11': false
                    }
                }
            }
        }
    })

    describe('computeAides injected values', function() {
        beforeEach(function() {
            droits = computeAides(situation, openfiscaResult)
        })

        it('should extract injected droits', function() {
            expect(droits.droitsInjectes).toContain(droitsDescription.prestationsNationales.caf.prestations.aah)
            expect(droits.droitsInjectes).toContain(droitsDescription.prestationsNationales.caf.prestations.aide_logement)
            expect(droits.droitsInjectes).toContain(droitsDescription.prestationsNationales.caf.prestations.ppa)
        })

        it('should not have injected droits duplicates', function() {
            expect(droits.droitsInjectes.filter(function(d) { return d.label == "Allocation aux adultes handicapés" }).length).toEqual(1)
        })
    })

    describe('computeAides of numeric value', function() {
        beforeEach(function() {
            droits = computeAides(situation, openfiscaResult)
        })

        it('should extract droits from openfisca result', function() {
            var css = droits.droitsEligibles.find(function(element) { return element.id === 'css_participation_forfaitaire' })
            expect(css).toBeTruthy()
            expect(css.montant).toEqual(10)
            expect(css.provider.label).toEqual('Assurance maladie')

            var plf = droits.droitsEligibles.find(function(element) { return element.id === 'paris_logement_familles' })
            expect(plf).toBeTruthy()
            expect(plf.provider.label).toEqual('Ville de Paris')
            expect(plf.montant).toEqual(10)

            var logement_social = droits.droitsNonEligibles.find(function(element) { return element.id === 'logement_social_eligible' })
            expect(logement_social).toBeTruthy()
            expect(logement_social.provider.label).toEqual('Ministère de la Cohésion des territoires')
        })
    })

    describe('computeAides of true boolean values', function() {
        beforeEach(function() {
            openfiscaResult.individus.demandeur.logement_social_eligible['2014-11'] = true
            droits = computeAides(situation, openfiscaResult)
        })

        it('should extract eligibles droits from openfisca result', function() {
            var logement_social = droits.droitsEligibles.find(function(element) { return element.id === 'logement_social_eligible' })
            expect(logement_social).toBeTruthy()
            expect(logement_social.montant).toBeTruthy()
        })
    })

    describe('computeAides uncomputability highlighted', function() {
        beforeEach(function() {
            droits = computeAides(situation, openfiscaResult)
        })

        it('should extract reason of uncomputability', function() {
            var rsa = droits.droitsEligibles.find(function(element) { return element.id === 'rsa' })
            expect(rsa.montant).toEqual('error')
        })
    })

    describe('computeAides extraction of local partenaire without prestation', function() {
        beforeEach(function() {
            droits = computeAides(situation, openfiscaResult)
        })

        it('should exclude local partenaire without prestation', function() {
            expect(droits.droitsEligibles.filter(function(p) { return p.provider.label == "Rennes Métropole" }).length).toBeFalsy()
        })
    })

    describe('computeAides exclude private aids', function() {
        beforeEach(function() {
            droits = computeAides(situation, openfiscaResult)
        })

        it('should exclude private aid', function() {
            var private_aid = droits.droitsEligibles.find(function(element) { return element.id === 'alfortville_noel_enfants' })
            expect(private_aid).toBeFalsy()
        })
    })
})

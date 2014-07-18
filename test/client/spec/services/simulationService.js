'use strict';

/* global _ */

describe('Service: situationService', function () {

    var service;

    beforeEach(function() {
        module('ddsApp');
        inject(function(SimulationService) {
            service = SimulationService;
        });
    });

    describe('function createApiCompatibleIndividu', function() {
        it('Should return a cloned version of the individu', function() {
            // given
            var individu = { birthDate: '14/09/1989', ressources: {} };

            // when
            var result = service.createApiCompatibleIndividu(individu);

            // then
            expect(result).not.toBe(individu);
        });

        it('Should format birth date properly', function() {
            // given
            var individu = { birthDate: '14/09/1989' };

            // when
            var result = service.createApiCompatibleIndividu(individu);

            // then
            expect(result.dateDeNaissance).toBeDefined();
            expect(result.dateDeNaissance).toBe('1989-09-14');
        });

        it('Should create an array of ressources from the ressources map', function() {
            // given
            var individu = { ressources: { salarie: {'2014-08': 245} } };

            // when
            var result = service.createApiCompatibleIndividu(individu);

            // then
            expect(_.isArray(result.ressources)).toBe(true);
            expect(result.ressources.length).toBe(1);
            expect(result.ressources[0]).toEqual({
                montant: 245,
                periode: '2014-08',
                type:  'salarie'
            });
        });
    });

    describe('function createApiCompatibleSituation', function() {
        it('Should return a cloned version of the situation', function() {
            // given
            var situation = { demandeur: {}, enfants: [], personnesACharge: [] };

            // when
            var result = service.createApiCompatibleSituation(situation);

            // then
            expect(result).not.toBe(situation);
        });

        it('Should set the role of the demandeur', function() {
            // given
            var situation = { demandeur: {}, enfants: [], personnesACharge: [] };

            // when
            var result = service.createApiCompatibleSituation(situation);

            // then
            expect(result.individus.length).toBe(1);
            expect(result.individus[0].role).toBe('demandeur');
        });

        it('Should include the conjoint if defined and set its role', function() {
            // given
            var situation = { demandeur: {}, conjoint: {}, enfants: [], personnesACharge: [] };

            // when
            var result = service.createApiCompatibleSituation(situation);

            // then
            expect(result.individus.length).toBe(2);
            expect(result.individus[1].role).toBe('conjoint');
        });

        it('Should include the children and set their role', function() {
            // given
            var situation = { demandeur: {}, enfants: [{}], personnesACharge: [] };

            // when
            var result = service.createApiCompatibleSituation(situation);

            // then
            expect(result.individus.length).toBe(2);
            expect(result.individus[1].role).toBe('enfant');
        });

        it('Should include the children and set their role', function() {
            // given
            var situation = { demandeur: {}, enfants: [], personnesACharge: [{}] };

            // when
            var result = service.createApiCompatibleSituation(situation);

            // then
            expect(result.individus.length).toBe(2);
            expect(result.individus[1].role).toBe('personneACharge');
        });
    });
});

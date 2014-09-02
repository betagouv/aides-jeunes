'use strict';

/* global _ */

describe('Service: situationService', function () {

    var service;

    beforeEach(function() {
        module('ddsApp');
        inject(function(SituationService) {
            service = SituationService;
        });
    });

    describe('function formatStatutsLabels', function() {
        it('Should return empty string if no specific situations', function() {
            // when
            var result = service.formatStatutsSpecifiques({});

            // then
            expect(result).toBe('');
        });

        it('Should return single situation with no comma', function() {
            // when
            var result = service.formatStatutsSpecifiques({retraite: true});

            // then
            expect(result).toBe('Retraité');
        });

        it('Should return several situations with commas', function() {
            // when
            var result = service.formatStatutsSpecifiques({etudiant: true, retraite: true});

            // then
            expect(result).toBe('Étudiant, retraité');
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
            var situation = { demandeur: {}, enfants: [], personnesACharge: [], logement: {} };

            // when
            var result = service.createApiCompatibleSituation(situation);

            // then
            expect(result).not.toBe(situation);
        });

        it('Should set the role of the demandeur', function() {
            // given
            var situation = { demandeur: {}, enfants: [], personnesACharge: [], logement: {} };

            // when
            var result = service.createApiCompatibleSituation(situation);

            // then
            expect(result.individus.length).toBe(1);
            expect(result.individus[0].role).toBe('demandeur');
        });

        it('Should include the conjoint if defined and set its role', function() {
            // given
            var situation = { demandeur: {}, conjoint: {}, enfants: [], personnesACharge: [], logement: {} };

            // when
            var result = service.createApiCompatibleSituation(situation);

            // then
            expect(result.individus.length).toBe(2);
            expect(result.individus[1].role).toBe('conjoint');
        });

        it('Should include the children and set their role', function() {
            // given
            var situation = { demandeur: {}, enfants: [{}], personnesACharge: [], logement: {} };

            // when
            var result = service.createApiCompatibleSituation(situation);

            // then
            expect(result.individus.length).toBe(2);
            expect(result.individus[1].role).toBe('enfant');
        });
    });

    describe('function createIndividusList', function() {
        it('Should create an array of individuals including demandeur', function() {
            // given
            var demandeur = {};
            var situation = {demandeur: demandeur, enfants: [], personnesACharge: []};

            // when
            var result = service.createIndividusList(situation);

            // then
            expect(result.length).toBe(1);
            expect(result[0]).toBe(demandeur);
        });

        it('Should include conjoint if defined', function() {
            // given
            var conjoint = {};
            var situation = {demandeur: {}, conjoint: conjoint, enfants: [], personnesACharge: []};

            // when
            var result = service.createIndividusList(situation);

            // then
            expect(result.length).toBe(2);
            expect(result[1]).toBe(conjoint);
        });

        it('Should include children', function() {
            // given
            var enfant = {};
            var situation = {demandeur: {}, enfants: [enfant], personnesACharge: []};

            // when
            var result = service.createIndividusList(situation);

            // then
            expect(result.length).toBe(2);
            expect(result[1]).toBe(enfant);
        });

        it('Should include personnes à charge', function() {
            // given
            var personne = {};
            var situation = {demandeur: {}, enfants: [], personnesACharge: [personne]};

            // when
            var result = service.createIndividusList(situation);

            // then
            expect(result.length).toBe(2);
            expect(result[1]).toBe(personne);
        });
    });

    describe('function individuLabel', function() {
        it('Should return "Vous" if individu has role demandeur', function() {
            // given
            var individu = {role: 'demandeur', firstName: 'Arnaud'};

            // when
            var result = service.individuLabel(individu);

            // then
            expect(result).toBe('Vous');
        });

        it('Should return "Votre conjoint" if individu has role conjoint', function() {
            // given
            var individu = {role: 'conjoint', firstName: 'Arnaud'};

            // when
            var result = service.individuLabel(individu);

            // then
            expect(result).toBe('Votre conjoint');
        });

        it('Should return the individu\'s first name if individu has role enfant', function() {
            // given
            var individu = {role: 'enfant', firstName: 'Arnaud'};

            // when
            var result = service.individuLabel(individu);

            // then
            expect(result).toBe('Arnaud');
        });

        it('Should return the individu\'s first name if individu has role personneACharge', function() {
            // given
            var individu = {role: 'personneACharge', firstName: 'Arnaud'};

            // when
            var result = service.individuLabel(individu);

            // then
            expect(result).toBe('Arnaud');
        });
    });

    describe('funtion getMonths()', function() {
        it('Should create an array of the last 3 months', function() {
            // when
            var result = service.getMonths();

            // then
            expect(result.length).toBe(3);
            var date = new Date();
            var month = '' + (date.getMonth() - 2);
            if (month.length === 1) {
                month = '0' + month;
            }
            var expectedDate = '' + date.getFullYear() + '-' + month;
            expect(result[0].id).toBe(expectedDate);
        });
    });
});

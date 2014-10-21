'use strict';

describe('Service: situationService', function () {

    var service;

    beforeEach(function() {
        module('ddsApp');
        inject(function(SituationService) {
            service = SituationService;
        });
    });

    describe('function createApiCompatibleIndividu()', function() {
        it('Should return a cloned version of the individu', function() {
            // given
            var individu = { dateDeNaissance: '14/09/1989' };

            // when
            var result = service.createApiCompatibleIndividu(individu);

            // then
            expect(result).not.toBe(individu);
        });

        it('Should format birth date as expected by the api', function() {
            // given
            var individu = { dateDeNaissance: '14/09/1989' };

            // when
            var result = service.createApiCompatibleIndividu(individu);

            // then
            expect(result.dateDeNaissance).toBeDefined();
            expect(result.dateDeNaissance).toBe('1989-09-14');
        });
    });

    describe('function createApiCompatibleSituation()', function() {
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

    describe('function createIndividusList()', function() {
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

    describe('function getMonths()', function() {
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

    describe('function flattenIndividuRessources()', function() {
        it('should export month-based ressources as-is without changing them', function() {
            // given
            var ressources = [{periode: '2014-06', montant: 400}];
            var individu = {ressources: ressources};

            // when
            var result = service.flattenIndividuRessources(individu);

            // then
            expect(individu.ressources[0]).toBe(ressources[0]);
        });

        it('should not export year-based ressources as-is', function() {
            // given
            var ressources = [{debutPeriode: '2014-06', finPeriode: '2014-08', montant: 300}];
            var individu = {ressources: ressources};

            // when
            var result = service.flattenIndividuRessources(individu);

            // then
            expect(individu.ressources.indexOf(ressources[0])).toBe(-1);
        });

        it('should flatten year-based ressources', function() {
            // given
            var ressources = [{debutPeriode: '2014-06', finPeriode: '2014-08', montant: 300}];
            var individu = {ressources: ressources};

            // when
            var result = service.flattenIndividuRessources(individu);

            // then
            expect(individu.ressources.length).toBe(3);
            expect(individu.ressources[0].periode).toBe('2014-06');
            expect(individu.ressources[0].montant).toBe(100);
        });

        it('should flatten the montant after subtracting corresponding month-based ressources in the period', function() {
            // given
            var ressources = [
                {debutPeriode: '2014-06', finPeriode: '2014-08', type: 'test', montant: 300},
                {periode: '2014-06', type: 'test', montant: 200},
                {periode: '2014-04', type: 'test', montant: 200}
            ];
            var individu = {ressources: ressources};

            // when
            var result = service.flattenIndividuRessources(individu);

            // then
            var ressourcesJuin = _.where(individu.ressources, {periode: '2014-06'});
            expect(ressourcesJuin.length).toBe(1);
            expect(ressourcesJuin[0]).toBe(ressources[1]);
            var ressourcesJuillet = _.where(individu.ressources, {periode: '2014-07'});
            expect(ressourcesJuillet.length).toBe(1);
            expect(ressourcesJuillet[0].montant).toBe(50);
        });
    });
});

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
        var basePatrimoine = {
            revenusLocatifs: [],
            revenusDuCapital: []
        };

        it('Should return a cloned version of the situation', function() {
            // given
            var situation = { individus: [{ role: 'demandeur' }], logement: {}, patrimoine: basePatrimoine };

            // when
            var result = service.createApiCompatibleSituation(situation);

            // then
            expect(result).not.toBe(situation);
        });

        it('Should set the role of the demandeur', function() {
            // given
            var situation = { individus: [{ role: 'demandeur' }], logement: {}, patrimoine: basePatrimoine };

            // when
            var result = service.createApiCompatibleSituation(situation);

            // then
            expect(result.individus.length).toBe(1);
            expect(result.individus[0].role).toBe('demandeur');
        });

        it('Should include the conjoint if defined and set its role', function() {
            // given
            var situation = { individus: [{ role: 'demandeur' }, { role: 'conjoint' }], logement: {}, patrimoine: basePatrimoine };

            // when
            var result = service.createApiCompatibleSituation(situation);

            // then
            expect(result.individus.length).toBe(2);
            expect(result.individus[1].role).toBe('conjoint');
        });

        it('Should include the children and set their role', function() {
            // given
            var situation = { individus: [{ role: 'demandeur' }, { role: 'enfant' }], logement: {}, patrimoine: basePatrimoine };

            // when
            var result = service.createApiCompatibleSituation(situation);

            // then
            expect(result.individus.length).toBe(2);
            expect(result.individus[1].role).toBe('enfant');
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
            service.flattenIndividuRessources(individu);

            // then
            expect(individu.ressources[0]).toBe(ressources[0]);
        });

        it('should not export year-based ressources as-is', function() {
            // given
            var ressources = [{debutPeriode: '2014-06', finPeriode: '2014-08', montant: 300}];
            var individu = {ressources: ressources};

            // when
            service.flattenIndividuRessources(individu);

            // then
            expect(individu.ressources.indexOf(ressources[0])).toBe(-1);
        });

        it('should flatten year-based ressources', function() {
            // given
            var ressources = [{debutPeriode: '2014-06', finPeriode: '2014-08', montant: 300}];
            var individu = {ressources: ressources};

            // when
            service.flattenIndividuRessources(individu);

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
            service.flattenIndividuRessources(individu);

            // then
            var ressourcesJuin = _.where(individu.ressources, {periode: '2014-06'});
            expect(ressourcesJuin.length).toBe(1);
            expect(ressourcesJuin[0]).toBe(ressources[1]);
            var ressourcesJuillet = _.where(individu.ressources, {periode: '2014-07'});
            expect(ressourcesJuillet.length).toBe(1);
            expect(ressourcesJuillet[0].montant).toBe(50);
        });
    });

    describe('function flattenPatrimoine()', function() {
        it('should keep month-based amounts as-is', function() {
            // given
            var patrimoine = {
                revenusLocatifs: [{periode: '2014-08', montant: 400}],
                revenusDuCapital: [{periode: '2014-12', montant: 400}]
            };

            // when
            service.flattenPatrimoine(patrimoine);

            // then
            expect(patrimoine.revenusLocatifs).toEqual([{periode: '2014-08', montant: 400}]);
            expect(patrimoine.revenusDuCapital).toEqual([{periode: '2014-12', montant: 400}]);
        });

        it('should split year-based amounts in months', function() {
            // given
            var patrimoine = {
                revenusLocatifs: [{debutPeriode: '2014-08', finPeriode: '2014-10', montant: 300}],
                revenusDuCapital: [{debutPeriode: '2014-05', finPeriode: '2014-06', montant: 200}]
            };

            // when
            service.flattenPatrimoine(patrimoine);

            // then
            expect(patrimoine.revenusLocatifs).toEqual([
                {periode: '2014-08', montant: 100},
                {periode: '2014-09', montant: 100},
                {periode: '2014-10', montant: 100}
            ]);
            expect(patrimoine.revenusDuCapital).toEqual([
                {periode: '2014-05', montant: 100},
                {periode: '2014-06', montant: 100}
            ]);
        });

        it('should split year-based amounts and diff amount with corresponding month ressources', function() {
            // given
            var patrimoine = {
                revenusLocatifs: [{debutPeriode: '2014-08', finPeriode: '2014-10', montant: 300}, {periode: '2014-08', montant: 100}],
                revenusDuCapital: [{debutPeriode: '2014-05', finPeriode: '2014-06', montant: 200}, {periode: '2014-06', montant: 100}]
            };

            // when
            service.flattenPatrimoine(patrimoine);

            // then
            expect(patrimoine.revenusLocatifs).toEqual([
                {periode: '2014-09', montant: 100},
                {periode: '2014-10', montant: 100},
                {periode: '2014-08', montant: 100},
            ]);
            expect(patrimoine.revenusDuCapital).toEqual([
                {periode: '2014-05', montant: 100},
                {periode: '2014-06', montant: 100}
            ]);
        });
    });
});

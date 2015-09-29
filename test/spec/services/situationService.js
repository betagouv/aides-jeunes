'use strict';

/* global moment, _ */

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
            var individu = { dateDeNaissance: moment('14/09/1989', 'DD/MM/YYYY') };

            // when
            var result = service.createApiCompatibleIndividu(individu);

            // then
            expect(result).not.toBe(individu);
        });

        it('Should format birth date as expected by the api', function() {
            // given
            var individu = { dateDeNaissance: moment('14/09/1989', 'DD/MM/YYYY') };

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
        it('Should create an array of the last 3 months before the provided date', function() {
            // given
            var dateDeValeur = '2013-01-15';
            var expectedDate = moment('2013-01-15').subtract(3, 'months').format('YYYY-MM');

            // when
            var result = service.getMonths(dateDeValeur);

            // then
            expect(result.length).toBe(3);
            expect(result[0].id).toBe(expectedDate);
        });

        it('Should create an array of the last 3 months before the current date if no ref date given', function() {
            // given
            var expectedDate = moment().subtract(3, 'months').format('YYYY-MM');

            // when
            var result = service.getMonths();

            // then
            expect(result.length).toBe(3);
            expect(result[0].id).toBe(expectedDate);
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

    describe('function hasEnfantScolarise()', function() {
        it('should return a truthy only when situation has a child with scolarite "college" or "lycee"', function() {
            // given
            var situations = [
                { individus: [{ role: 'enfant', scolarite: 'college' }] },
                { individus: [{ role: 'enfant', scolarite: 'lycee' }] },
                { individus: [] }
            ];

            // when
            var results = _.map(situations, function(situation) {
                return service.hasEnfantScolarise(situation);
            });

            // then
            expect(results[0]).toBeTruthy();
            expect(results[1]).toBeTruthy();
            expect(results[2]).toBeFalsy();
        });
    });
});

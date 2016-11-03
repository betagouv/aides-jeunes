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

    describe('function hasEnfant()', function() {
        it('should return a truthy when there is a child', function() {
            // given
            var situations = [
                { individus: [{ role: 'enfant'}] },
            ];

            // when
            var results = _.map(situations, function(situation) {
                return service.hasEnfant(situation);
            });

            // then
            expect(results[0]).toBeTruthy();
        });
    });
    describe('function hasEnfant()', function() {
        it('should return a falsy when there is no child', function() {
            // given
            var situations = [
                { individus: [{ role: 'demandeur' }]},
            ];

            // when
            var results = _.map(situations, function(situation) {
                return service.hasEnfant(situation);
            });

            // then
            expect(results[0]).toBeFalsy();
        });
    });
    describe('function setConjoint()', function() {
        it('should add the conjoint at the end of the individus array', function() {
            // given
            var situation = {
                individus:
                    [
                        { role: 'demandeur' },
                        { role: 'enfant' }
                    ]
            };
            var conjoint = { role : 'conjoint' };

            // when
            service.setConjoint(situation, conjoint);
            // then
            expect(situation.individus[2].role).toBe('conjoint');
        });
        it('should replace the conjoint if it already exists', function() {
            // given
            var situation = {
                individus:
                    [
                        { role: 'demandeur' },
                        { role: 'enfant' },
                        { role: 'conjoint', name: 'Alice' }
                    ]
            };
            var conjoint = { role : 'conjoint', name: 'Bob' };

            // when
            service.setConjoint(situation, conjoint);
            // then
            expect(situation.individus[2].name).toBe('Bob');
        });
    });
    describe('function setEnfants()', function() {
        it('should add the enfants before the conjoint in the individus array', function() {
            // given
            var situation = {
                individus:
                    [
                        { role: 'demandeur' },
                        { role: 'enfant' },
                        { role: 'conjoint' }
                    ]
            };
            var enfants = [{ role : 'enfant' }, { role: 'enfant' }];

            // when
            service.setEnfants(situation, enfants);
            // then
            expect(situation.individus[2].role).toBe('enfant');
            expect(situation.individus[3].role).toBe('conjoint');
        });
        it('should replace the enfants if they already exist', function() {
            // given
            var situation = {
                individus:
                    [
                        { role: 'demandeur' },
                        { role: 'enfant', name:'Alice' },
                        { role: 'conjoint' }
                    ]
            };
            var enfants = [{ role : 'enfant', name:'Bob' }];

            // when
            service.setEnfants(situation, enfants);
            // then
            expect(situation.individus.length).toBe(3);
            expect(situation.individus[1].name).toBe('Bob');
        });
    });

    describe('function ressourcesYearMoins2Captured()', function() {
        it('should detect N-2 ressources', function() {
            // given
            var situation = {
                individus:
                    [
                        { ressources: []},
                        { ressources: [{ type: 'rncPensionsRetraitesRentes'}]}
                    ]
            };

            // when
            var ressources_captured = service.ressourcesYearMoins2Captured(situation);
            // then
            expect(ressources_captured).toBeTruthy();
        });
        it('should ignore other ressources', function() {
            // given
            var situation = {
                individus:
                    [
                        { ressources: [{ type: 'revenusSalarie'}]}
                    ]
            };

            // when
            var ressources_captured = service.ressourcesYearMoins2Captured(situation);
            // then
            expect(ressources_captured).toBeFalsy();
        });
        it('should detect rfr', function() {
            // given
            var situation = {
                individus:
                    [
                        { ressources: []},
                    ],
                rfr: 20000
            };

            // when
            var ressources_captured = service.ressourcesYearMoins2Captured(situation);
            // then
            expect(ressources_captured).toBeTruthy();
        });
    });
});

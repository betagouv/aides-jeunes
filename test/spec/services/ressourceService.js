'use strict';

describe('RessourceService', function () {
    var service,
    individu,
    dateDeValeur,
    ressource;

    beforeEach(function() {
        module('ddsApp');
        inject(function(RessourceService) {
            service = RessourceService;
        });
        individu = {};
        dateDeValeur = Date();
    });

    describe('getPeriodKeysForCurrentYear', function() {
        it('should provide 13 periods by default', function() {
            var periodKeys = service.getPeriodKeysForCurrentYear(dateDeValeur, { id: 'basic' });

            expect(_.size(periodKeys)).toEqual(13);
        });

        it('should provide 12 zeros for exceptionnal ressource', function() {
            var periodKeys = service.getPeriodKeysForCurrentYear(dateDeValeur, { id: 'exceptionnal', revenuExceptionnel: true });

            expect(_.size(periodKeys)).toEqual(12);
        });

        it('should provide 1 zero for annual ressource', function() {
            var periodKeys = service.getPeriodKeysForCurrentYear(dateDeValeur, { id: 'annual', isMontantAnnuel: true });

            expect(periodKeys.length).toEqual(1);
            expect(periodKeys[0].length).toEqual(4); // year YYYY
        });
    });

    describe('setDefaultValueForCurrentYear', function() {
        it('should provide 13 zeros by default', function() {
            var individu = {};
            var periodKeys = service.setDefaultValueForCurrentYear(dateDeValeur, individu, { id: 'basic' });

            expect(_.size(individu.basic)).toEqual(13);
            expect(_.size(_.filter(individu.basic, function(v) { return v === 0; }))).toEqual(13);
        });

        it('shouldn‘t amend the ressource if a value is provided for a period in the current year', function() {
            var currentMonth = moment(dateDeValeur).format('YYYY-MM');
            var individu = {
                basic: {}
            };
            individu.basic[currentMonth] = 0;

            var periodKeys = service.getPeriodKeysForCurrentYear(dateDeValeur, individu, { id: 'basic' });

            expect(_.size(individu.basic)).toEqual(1);
        });
    });

    describe('unsetForCurrentYear', function() {
        it('should drop ressource', function() {
            individu.basic = {};
            var periodKeys = service.unsetForCurrentYear(dateDeValeur, individu, { id: 'basic' });

            expect(individu.basic).toBe(undefined);
        });

        it('should keep values outside of current year', function() {
            individu.old = {
                '1989': 42,
            };
            var recentMonthKey = moment(dateDeValeur).subtract(2, 'months').format('YYYY-MM');
            individu.old[recentMonthKey] = 1;
            var periodKeys = service.unsetForCurrentYear(dateDeValeur, individu, { id: 'old' });

            expect(_.size(individu.old)).toEqual(1);
            expect(individu.old[recentMonthKey]).toBe(undefined);
        });
    });

    describe('isRessourceOnMainScreen', function() {
        it('should filter pensions alimentaires versées and RNC resources', function() {
            var types = ['salaire_net_hors_revenus_exceptionnels', 'pensions_alimentaires_versees_individu'];
            var ressourcesTypes = [
                {
                    id: 'pensions_alimentaires_percues',
                },
                {
                    id: 'pensions_alimentaires_versees_individu',
                }
            ];
            var filteredTypes = types.filter(service.isRessourceOnMainScreen);
            var filteredRessourcesTypes = ressourcesTypes.filter(service.isRessourceOnMainScreen);
            expect(filteredTypes).toEqual(['salaire_net_hors_revenus_exceptionnels']);
            expect(filteredRessourcesTypes).toEqual([ { 'id': 'pensions_alimentaires_percues' } ]);
        });
    });


    describe('extractIndividuSelectedRessourceTypes', function() {

        it('should retrieve the selected ressource types in the selectedRessourceTypes map if individus have ressources', function() {
            // given
            var individu = {
                indemnites_stage: {},
                salaire_net_hors_revenus_exceptionnels: {},
            };

            // when
            var selectedTypes = service.extractIndividuSelectedRessourceTypes(individu);

            // then
            expect(selectedTypes).toEqual({
                salaire_net_hors_revenus_exceptionnels: true,
                indemnites_stage: true,
            });
        });

        it('should not map pensions alimentaires versées to the view model', function() {
            // given
            var individu = {
                pensions_alimentaires_versees_individu: {
                    '2012-10': 100,
                    '2012-11': 100,
                },
            };

            // when
            var selectedTypes = service.extractIndividuSelectedRessourceTypes(individu);

            // then
            expect(selectedTypes).toEqual({});
        });

        it('should map ressources micro-entreprise', function() {
            // given
            var individu = {
                tns_micro_entreprise_chiffre_affaires: {
                    '2014': 1000
                },
            };

            // when
            var selectedTypes = service.extractIndividuSelectedRessourceTypes(individu);

            // then
            expect(selectedTypes).toEqual({ tns_micro_entreprise_chiffre_affaires: true });
        });

        describe('specific behavior of ym2 ressources', function() {

            it('should capture monthly declaration', function() {
                // given
                var individu = {
                    pensions_alimentaires_percues: {
                        '2015-01': 41,
                        '2015-02': 42,
                    },
                };

                // when
                var selectedTypes = service.extractIndividuSelectedRessourceTypes(individu);

                // then
                expect(selectedTypes).toEqual({
                    pensions_alimentaires_percues: true,
                });
            });

            it('should not capture yearly declaration', function() {
                // given
                var individu = {
                    pensions_alimentaires_percues: {
                        '2015': 41,
                    },
                };

                // when
                var selectedTypes = service.extractIndividuSelectedRessourceTypes(individu);

                // then
                expect(selectedTypes).toEqual({});
            });
        });
    });
});

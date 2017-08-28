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

    describe('setDefaultRessourceValueForCurrentYear', function() {
        it('should provide 13 zeros by default', function() {

            service.setDefaultRessourceValueForCurrentYear(dateDeValeur, individu, { id: 'basic' });

            expect(_.size(individu.basic)).toEqual(13);
            expect(_.countBy(individu.basic)['0']).toEqual(13);
        });

        it('should provide 12 zeros for exceptionnal ressource', function() {
            service.setDefaultRessourceValueForCurrentYear(dateDeValeur, individu, { id: 'exceptionnal', revenuExceptionnel: true });

            expect(_.size(individu.exceptionnal)).toEqual(12);
            expect(_.countBy(individu.exceptionnal)['0']).toEqual(12);
        });

        it('should provide 1 zero for annual ressource', function() {
            service.setDefaultRessourceValueForCurrentYear(dateDeValeur, individu, { id: 'annual', isMontantAnnuel: true });

            var keys = Object.keys(individu.annual);
            expect(keys.length).toEqual(1);
            expect(keys[0].length).toEqual(4); // year YYYY
            expect(_.values(individu.annual)).toEqual([0]);
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

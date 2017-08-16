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

    describe('setDefaultRessourceValue', function() {
        it('should provide 13 zeros by default', function() {

            service.setDefaultRessourceValue(dateDeValeur, individu, { id: 'basic' });

            expect(Object.keys(individu.basic).length).toEqual(13);
            expect(_.countBy(individu.basic)['0']).toEqual(13);
        });

        it('should provide 12 zeros for exceptionnal ressource', function() {
            service.setDefaultRessourceValue(dateDeValeur, individu, { id: 'exceptionnal', revenuExceptionnel: true });

            expect(Object.keys(individu.exceptionnal).length).toEqual(12);
            expect(_.countBy(individu.exceptionnal)['0']).toEqual(12);
        });

        it('should provide 1 zero for annual ressource', function() {
            service.setDefaultRessourceValue(dateDeValeur, individu, { id: 'annual', isMontantAnnuel: true });

            var keys = Object.keys(individu.annual);
            expect(keys.length).toEqual(1);
            expect(keys[0].length).toEqual(4); // year YYYY
            expect(_.values(individu.annual)).toEqual([0]);
        });
    });

    describe('isRessourceOnMainScreen', function() {
        it('should filter pensions alimentaires versées and RNC resources', function() {
            var types = ['salaire_net_hors_revenus_exceptionnels', 'pensions_alimentaires_versees_individu', 'chomage_imposable'];
            var ressources = [
                {
                    'type': 'pensions_invalidite',
                },
                {
                    'type': 'pensions_alimentaires_versees_individu',
                },
                {
                    'type': 'frais_reels',
                }
            ];
            var ressourcesTypes = [
                {
                    id: 'pensions_invalidite',
                },
                {
                    id: 'pensions_alimentaires_versees_individu',
                }
            ];
            var filteredTypes = types.filter(service.isRessourceOnMainScreen);
            var filteredRessources = ressources.filter(service.isRessourceOnMainScreen);
            var filteredRessourcesTypes = ressourcesTypes.filter(service.isRessourceOnMainScreen);
            expect(filteredTypes).toEqual(['salaire_net_hors_revenus_exceptionnels']);
            expect(filteredRessources).toEqual([ { 'type': 'pensions_invalidite' } ]);
            expect(filteredRessourcesTypes).toEqual([ { 'id': 'pensions_invalidite' } ]);
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
            expect(selectedTypes).toEqual({ salaire_net_hors_revenus_exceptionnels: true, indemnites_stage: true });
        });

        it('should not map pensions alimentaires versées to the view model', function() {
            // given
            var individu = {
                pensions_alimentaires_versees_individu: {
                    '2012-10': 100,
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
    });
});

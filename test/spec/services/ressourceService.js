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

    describe('_applyYearlyRessource', function() {
        it('should add a yearly ressource to individu model ', function() {
            ressource = {
                type: {
                    id: 'tns_benefice_exploitant_agricole'
                },
                montantAnnuel: 12000,
                periode: 2014
            };
            individu.ressources = [];
            service._applyYearlyRessource(individu, ressource, dateDeValeur);
            expect(individu.ressources).not.toEqual([]);
            expect(individu.ressources[0].type).toEqual('tns_benefice_exploitant_agricole');
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
});

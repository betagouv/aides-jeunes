'use strict';

describe('ResultatService', function () {
    var service,
    individu,
    dateDeValeur,
    ressource;

    beforeEach(function() {
        module('ddsApp');
        inject(function(RessourceService) {
            service = RessourceService;
        });
        individu = {
            ressources: []
        };
        dateDeValeur = Date();
    });

    describe('applyYearlyRessource', function() {
        it('should add a yearly ressource to individu model ', function() {
            ressource = {
                type: {
                    id: 'tns_benefice_exploitant_agricole'
                },
                montantAnnuel: 12000,
                periode: 2014
            };
            service.applyYearlyRessource(individu, ressource, dateDeValeur);
            expect(individu.ressources).not.toEqual([]);
            expect(individu.ressources[0].type).toEqual('tns_benefice_exploitant_agricole');
        });
    });
    describe('isRessourceOnMainScreen', function() {
        it('should filter pensions alimentaires versées and RNC resources', function() {
            var types = ['revenusSalarie', 'pensions_alimentaires_versees_individu', 'rncAutresRevenus'];
            var ressources = [
                {
                    'type': 'pensions_invalidite',
                },
                {
                    'type': 'pensions_alimentaires_versees_individu',
                },
                {
                    'type': 'fraisReelsDeductibles',
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
            expect(filteredTypes).toEqual(['revenusSalarie']);
            expect(filteredRessources).toEqual([ { 'type': 'pensions_invalidite' } ]);
            expect(filteredRessourcesTypes).toEqual([ { 'id': 'pensions_invalidite' } ]);
        });
    });
});

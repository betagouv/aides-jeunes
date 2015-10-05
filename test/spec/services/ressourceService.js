'use strict';

describe('ResultatService', function () {
    describe('applyYearlyRessource', function() {
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

        it('should add a yearly ressource to individu model ', function() {
            ressource = {
                type: {
                    id: 'revenusAgricolesTns'
                },
                montantAnnuel: 12000,
                periode: 2014
            };
            service.applyYearlyRessource(individu, ressource, dateDeValeur);
            expect(individu.ressources).not.toEqual([]);
            expect(individu.ressources[0].type).toEqual('revenusAgricolesTns');
        });

        it('should add caAutresRevenusTns to individu model when autresRevenusTns are declared', function() {
            ressource = {
                type: {
                    id: 'autresRevenusTns'
                },
                montantAnnuel: 12000,
                caAnnuel: 20000,
                periode: 2014
            };
            service.applyYearlyRessource(individu, ressource, dateDeValeur);
            expect(individu.ressources).not.toEqual([]);
            expect(individu.ressources[0].type).toEqual('autresRevenusTns');
            expect(individu.ressources[1].type).toEqual('caAutresRevenusTns');
        });
    });
});

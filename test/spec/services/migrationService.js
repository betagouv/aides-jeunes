'use strict';

describe('MigrationService', function() {
    var service;

    beforeEach(function() {
        module('ddsApp', function($provide) {
            $provide.value('droitsDescription', {});
        });
        inject(function(MigrationService) {
            service = MigrationService;
        });
    });

    describe('migratePersistedSituation', function() {
        it('should transform ressources', function() {
            var sourceSituation = {
                individus: [{
                    specificSituations: [],
                    ressources: [{
                        montant: 100,
                        periode: '2015-08',
                        type: 'pensions_alimentaires_percues',
                    }],
                }],
                logement: {
                    adresse : {},
                },
            };
            var situation = service.migratePersistedSituation(sourceSituation);

            expect(situation.individus.length).toEqual(1);
            expect(situation.individus[0].pensions_alimentaires_percues['2015-08']).toEqual(100);
        });
    });
});

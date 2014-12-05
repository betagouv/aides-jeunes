'use strict';

/* global _ */

describe('Controller: FoyerRessourceYearMoins2Ctrl', function() {

    beforeEach(function() {
        module('ddsApp');
    });

    describe('initialization', function() {
        it('should create an array of individu references to parents of the situation', function() {
            // given
            var demandeur = { role: 'demandeur' };
            var conjoint = { role: 'conjoint' };
            var scope = { situation: { individus: [demandeur, conjoint, { role: 'enfant' }, { role: 'personneACharge' }] }};

            // when
            inject(function($controller) {
                $controller('FoyerRessourceYearMoins2Ctrl', {
                    $scope: scope
                });
            });

            // then
            expect(scope.individuRefs.length).toBe(2);
            expect(scope.individuRefs[0].individu).toBe(demandeur);
            expect(scope.individuRefs[1].individu).toBe(conjoint);
        });

        it('should init all amounts to zero', function() {
            // given
            var scope = { situation: { individus: [{ role: 'demandeur' }] }};

            // when
            inject(function($controller) {
                $controller('FoyerRessourceYearMoins2Ctrl', {
                    $scope: scope
                });
            });

            // then
            expect(scope.individuRefs[0].rnc.length).toBeGreaterThan(0);
            expect(_.all(scope.individuRefs[0].rnc, function(rnc) { return rnc.montant === 0; })).toBe(true);
        });
    });

    describe('function submit()', function() {
        it('should set non-null captured amounts in the ressources field of each individu', function() {
            // given
            var demandeur = { role: 'demandeur', ressources: [] };
            var scope = { situation: { individus: [demandeur], logement: {}}};
            inject(function($controller) {
                $controller('FoyerRessourceYearMoins2Ctrl', {
                    $scope: scope
                });
            });

            // when
            scope.individuRefs[0].rnc[0].montant = 10000;
            scope.submit();

            // then
            expect(demandeur.ressources.length).toBe(1);
            expect(demandeur.ressources[0].type).toBe(scope.individuRefs[0].rnc[0].categorie.id);
            expect(demandeur.ressources[0].montant).toBe(10000);
        });

        it('should save the situation', function() {
            // given
            var scope = { situation: { individus: [], logement: {}}};
            var SituationService;
            inject(function(_SituationService_, $controller) {
                SituationService = _SituationService_;
                $controller('FoyerRessourceYearMoins2Ctrl', {
                    $scope: scope,
                    SituationService: SituationService
                });
            });
            spyOn(SituationService, 'update').andReturn({ then: function() {}});

            // when
            scope.submit();

            // then
            expect(SituationService.update).toHaveBeenCalledWith(scope.situation);
        });
    });
});

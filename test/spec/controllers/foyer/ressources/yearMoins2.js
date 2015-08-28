'use strict';

describe('Controller: FoyerRessourceYearMoins2Ctrl', function() {

    beforeEach(function() {
        module('ddsApp');
    });

    describe('initialization', function() {
        it('should create an array of individu references to parents of the situation', function() {
            // given
            var demandeur = { role: 'demandeur' };
            var conjoint = { role: 'conjoint' };
            var scope = { situation: { individus: [demandeur, conjoint, { role: 'enfant' }] }};

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

        it('should not save anything if the user did not fill his.her income', function() {
            // given
            var scope = { situation: { individus: [{ role: 'demandeur' }] }, $emit: function() {}};

            // when
            inject(function($controller) {
                $controller('FoyerRessourceYearMoins2Ctrl', {
                    $scope: scope
                });
            });
            scope.submit();
            // then
            expect(scope.individuRefs[0].rnc.length).toBe(0);

        });
    });

    describe('function submit()', function() {
        var scope;

        beforeEach(function() {
            scope = { situation: { individus: [], logement: {}}, $emit: function() {}};
        });

        it('should set amounts in the ressources field of each individu', function() {
            // given
            var demandeur = { role: 'demandeur', ressources: [] };
            scope.situation.individus.push(demandeur);
            inject(function($controller) {
                $controller('FoyerRessourceYearMoins2Ctrl', {
                    $scope: scope
                });
            });

            // when
            scope.individuRefs[0].rnc[0].montant = 10000;
            scope.submit();

            // then
            expect(demandeur.ressources[0].type).toBe(scope.individuRefs[0].rnc[0].categorie.id);
            expect(demandeur.ressources[0].montant).toBe(10000);
        });
    });
});

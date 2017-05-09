'use strict';

describe('Controller: FoyerRessourceYearMoins2Ctrl', function() {

    beforeEach(function() {
        module('ddsApp');
    });

    describe('initialization', function() {
        it('should by default only ask for parents Y-2 revenus', function() {
            // given
            var demandeur = { role: 'demandeur' };
            var conjoint = { role: 'conjoint' };
            var enfant = { role: 'enfant' };
            var scope = { situation: { individus: [demandeur, conjoint, enfant] }};

            // when
            inject(function($controller) {
                $controller('FoyerRessourceYearMoins2Ctrl', {
                    $scope: scope
                });
            });

            // then
            expect(scope.individuRefsToDisplay.length).toBe(2);
            expect(scope.individuRefsToDisplay[0].individu).toBe(demandeur);
            expect(scope.individuRefsToDisplay[1].individu).toBe(conjoint);
        });

        it('should compute default value on the fly from montantAnnuels', function() {
            // given
            var demandeur = {
                role: 'demandeur',
                ressources: [
                    { type: 'salaire_net_hors_revenus_exceptionnels', montant: 6000 },
                    { type: 'salaire_net_hors_revenus_exceptionnels', montant: 6000 },
                    { type: 'notsalaire_net_hors_revenus_exceptionnels', montant: 6000 },
                ]
            };

            var scope = { situation: { individus: [demandeur] }};

            // when
            inject(function($controller) {
                $controller('FoyerRessourceYearMoins2Ctrl', {
                    $scope: scope
                });
            });

            // then
            expect(scope.getDefaultValue(scope.individuRefsToDisplay[0], { sources: ['salaire_net_hors_revenus_exceptionnels'] })).toBe(12000);
        });

        it('should display children Y-2 revenus if they have been filled', function() {
            // given
            var enfant = {
                role: 'enfant',
                ressources: [{ type: 'salaire_imposable_ym2', montant:4000 }]
            };
            var scope = { situation: { individus: [{ role: 'demandeur' }, enfant] }};

            // when
            inject(function($controller) {
                $controller('FoyerRessourceYearMoins2Ctrl', {
                    $scope: scope
                });
            });

            // then
            expect(scope.individuRefsToDisplay.length).toBe(2);
            expect(scope.individuRefsToDisplay[1].individu).toBe(enfant);
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
            expect(scope.individuRefsToDisplay[0].rnc.length).toBe(0);

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
            scope.individuRefsToDisplay[0].rnc[0].montant = 10000;
            scope.submit();

            // then
            expect(demandeur.ressources[0].type).toBe(scope.individuRefsToDisplay[0].rnc[0].categorie.id);
            expect(demandeur.ressources[0].montant).toBe(10000);
        });
    });
});

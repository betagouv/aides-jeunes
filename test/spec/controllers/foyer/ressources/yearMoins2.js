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
                salaire_net_hors_revenus_exceptionnels: {
                    '2013-03': 6000,
                },
            };

            var scope = {
                situation: {
                    individus: [demandeur],
                    dateDeValeur: '2013-04-10',
                },
            };

            // when
            inject(function($controller) {
                $controller('FoyerRessourceYearMoins2Ctrl', {
                    $scope: scope,
                });
            });

            // then
            expect(scope.getDefaultValue(scope.individuRefsToDisplay[0], { sources: ['salaire_net_hors_revenus_exceptionnels'] })).toBe(6000);
        });

        it('should display children Y-2 revenus if they have been filled', function() {
            // given
            var enfant = {
                role: 'enfant',
                salaire_imposable_ym2: {
                    '2011': 4000,
                },
            };

            var scope = {
                situation: {
                    individus: [{ role: 'demandeur' }, enfant],
                    dateDeValeur: '2013-04-10',
                },
            };

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
    });
});

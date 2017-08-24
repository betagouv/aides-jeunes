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
                salaire_imposable: {
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

    function initControllerForSubmitWithInitialValue(initialValue) {
        // given
        var demandeur = {
            role: 'demandeur',
            frais_reels: {
                '2014': initialValue,
            },
        };
        var conjoint = { role: 'conjoint' };
        var enfant = { role: 'enfant' };
        var scope = {
            situation: {
                dateDeValeur: '2016-08-23',
                individus: [demandeur, conjoint, enfant],
            },
            $emit: function() {},
        };

        // when
        inject(function($controller) {
            $controller('FoyerRessourceYearMoins2Ctrl', {
                $scope: scope
            });
        });

        return scope;
    }

    describe('frais reels rounding mitigation', function() {
        it('should by default only ask for parents Y-2 revenus', function() {
            var scope = initControllerForSubmitWithInitialValue(42.24);
            var demandeur = scope.situation.individus[0];

            scope.submit();
            expect(demandeur.frais_reels['2014']).toBe(42);
        });
    });

    describe('null removal', function() {
        it('should drop nulls in Y-2 ressources', function() {
            var scope = initControllerForSubmitWithInitialValue(null);
            var demandeur = scope.situation.individus[0];

            scope.submit();
            expect('2014' in demandeur.frais_reels).toBe(false);
        });

        it('should keep zeros in Y-2 ressources', function() {
            var scope = initControllerForSubmitWithInitialValue(0);
            var demandeur = scope.situation.individus[0];

            scope.submit();
            expect(demandeur.frais_reels['2014']).toBe(0);
        });
    });
});

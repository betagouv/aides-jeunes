    'use strict';

describe('Controller: FoyerPatrimoineCtrl', function() {
    var scope;

    beforeEach(function() {
        scope = {
            situation: {
                dateDeValeur: '2013-04-10',
                famille: {},
                individus: [{
                    role: 'demandeur',
                }],
            },
            $watch: function() {},
        };
        module('ddsApp');
    });


    var initController = function() {
        inject(function($controller) {
            $controller('FoyerPatrimoineCtrl', {
                $scope: scope
            });
        });
    };

    describe('hasBiensLoues', function() {
        it('is false by default', function() {
            initController();

            expect(scope.locals.hasBiensLoues).toBeFalsy();
        });

        it('is true with revenus_locatifs', function() {
            scope.situation.individus.push({
                role: 'conjoint',
                revenus_locatifs: {}
            });
            initController();

            expect(scope.locals.hasBiensLoues).toBeTruthy();
        });
    });

    describe('hasTerrainsNonLoues', function() {
        it('is false by default', function() {
            initController();

            expect(scope.locals.hasTerrainsNonLoues).toBeFalsy();
        });

        it('is false with null valeur_locative_terrains_non_loues', function() {
            scope.situation.individus[0].valeur_locative_terrains_non_loues = {'2012-01': 0 };
            initController();

            expect(scope.locals.hasTerrainsNonLoues).toBeFalsy();
        });

        it('is true with *terrains_non_loues', function() {
            scope.situation.individus[0].valeur_locative_terrains_non_loues = {'2012-01': 1 };
            initController();

            expect(scope.locals.hasTerrainsNonLoues).toBeTruthy();
        });
    });
});

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
});

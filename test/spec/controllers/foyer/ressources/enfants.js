'use strict';

describe('Controller: FoyerRessourcesEnfantsCtrl', function() {
    var scope, controller;

    beforeEach(function() {
        scope = {
            situation: {
                dateDeValeur: '2013-04-10',
                individus: [
                    { role: 'demandeur' },
                    { role: 'conjoint' },
                    { id: 'enfant_0', role: 'enfant', firstName: 'Jérome' },
                    { id: 'enfant_1', role: 'enfant', firstName: 'Tom', primes_salaires_net: { '2012-12': 42 } },
                ],
            }
        };
        module('ddsApp');
        inject(function($controller) {
            controller = $controller;
        });
    });

    var initController = function() {
        controller('FoyerRessourcesEnfantsCtrl', {
            $scope: scope,
        });
    };

    describe('initialization', function() {
        it('should set enfants object', function() {
            // when
            initController();

            // then
            var enfantKeyed = _.keyBy(scope.enfants, 'id');
            expect(enfantKeyed.enfant_0.hasRessources).toEqual(false);
            expect(enfantKeyed.enfant_1.hasRessources).toEqual(true);
        });
    });
});

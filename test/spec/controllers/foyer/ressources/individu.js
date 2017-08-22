'use strict';

describe('Controller: FoyerRessourcesIndividuCtrl', function() {

    var scope, demandeur, controller;

    beforeEach(function() {
        scope = {
            situation: { dateDeValeur: '2013-04-10' },
            sortedIndividus: [{ role: 'demandeur' }, { role: 'conjoint' }, { role: 'enfant', firstName: 'Jérome' }]
        };
        demandeur = scope.sortedIndividus[0];
        module('ddsApp');
        inject(function($controller) {
            controller = $controller;
        });
    });

    var initController = function(individuIndex) {
        controller('FoyerRessourcesIndividuCtrl', {
            $scope: scope,
            $stateParams: { individu: individuIndex || 0 },
        });
    };

    describe('initialization', function() {
        it('should set the page title to "Vos ressources" if individu is demandeur', function() {
            // given
            var individuIndex = 0;

            // when
            initController(individuIndex);

            // then
            expect(scope.pageTitle).toBe('Vos ressources');
        });

        it('should set the page title to "Les ressources de votre conjoint" if individu is conjoint', function() {
            // given
            var individuIndex = 1;

            // when
            initController(individuIndex);

            // then
            expect(scope.pageTitle).toBe('Les ressources de votre conjoint');
        });

        it('should set the page title to the first name if individu is not parent', function() {
            // given
            var individuIndex = 2;

            // when
            initController(individuIndex);

            // then
            expect(scope.pageTitle).toBe('Les ressources de Jérome');
        });
    });
});

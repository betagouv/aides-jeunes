'use strict';

describe('Controller: FoyerRessourcesIndividuCtrl', function() {

    var scope, controller;

    beforeEach(function() {
        scope = {
            situation: {
                dateDeValeur: '2013-04-10',
                individus: [{ role: 'demandeur' }, { role: 'enfant', firstName: 'Jérome' }, { role: 'conjoint' }]
            }
        };
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
        it('should set the page title to "Vos ressources personnelles uniquement" if individu is demandeur', function() {
            // given
            var individuIndex = 0;

            // when
            initController(individuIndex);

            // then
            expect(scope.pageTitle).toBe('Vos ressources personnelles uniquement');
        });

        it('should set the page title to "Les ressources de votre conjoint·e" if individu is conjoint', function() {
            // given
            var individuIndex = 1;

            // when
            initController(individuIndex);

            // then
            expect(scope.pageTitle).toBe('Les ressources de votre conjoint·e');
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

'use strict';

describe('Controller: RecapSituationCtrl', function() {

    var scope, _ressourceTypes_;

    beforeEach(function() {
        module('ddsApp');
        inject(function(ressourceTypes, $rootScope) {
            _ressourceTypes_ = ressourceTypes;
            scope = $rootScope.$new();
            scope.situation = {
                individus: [],
                foyer_fiscal: {},
            };
        });
    });

    var initController = function() {
        inject(function($controller) {
            $controller('RecapSituationCtrl', {
                $scope: scope,
                ressourceTypes: _ressourceTypes_
            });
        });
    };

    describe('ressourcesUpdated event', function() {
        it('should set the ressourcesCaptured value to true', function() {
            // given
            scope.situation.dateDeValeur = '2013-04-05';
            initController();

            // when
            scope.$broadcast('ressourcesUpdated');

            // then
            expect(scope.ressourcesCaptured).toBe(true);
        });
    });
});

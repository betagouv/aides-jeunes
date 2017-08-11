'use strict';

describe('Controller: FoyerRessourcesMontantsCtrl', function() {

    var scope, _ressourceTypes_, form;

    beforeEach(function() {
        scope = {
            situation: { dateDeValeur: '2013-04-10' },
            declareNextIndividuResources: function() {},
        };
        form = { $valid: true };
        module('ddsApp');
        inject(function(ressourceTypes) {
            _ressourceTypes_ = ressourceTypes;
        });

        inject(function(MonthService) {
            scope.months = MonthService.getMonths(scope.situation.dateDeValeur);
        });
    });

    var initController = function() {
        inject(function($controller) {
            $controller('FoyerRessourcesMontantsCtrl', {
                $scope: scope,
                ressourceTypes: _ressourceTypes_
            });
        });
    };

    var initControllerWithRessource = function(ressourceName) {
        scope.selectedRessourceTypes = {};
        scope.selectedRessourceTypes[ressourceName] = true;
        scope.individu = {};
        scope.individu[ressourceName] = {};
        initController();
    };

});

'use strict';

describe('Controller: FoyerRessourceTypesCtrl', function() {
    var scope, _ressourceTypes_, _ressourceCategories_, controller;
    var month = '2019-07';

    beforeEach(function() {
        module('ddsApp');
        inject(function(ressourceTypes, ressourceCategories, $controller, $rootScope) {
            _ressourceTypes_ = ressourceTypes;
            _ressourceCategories_ = ressourceCategories;
            controller = $controller;
            scope = $rootScope.$new();
        });

        scope.selectedRessourceTypes = {};
        scope.situation = { dateDeValeur: month + '-10' };
        scope.ressources = [];
        scope.declareNextIndividuResources = function() {};
    });

    var initController = function(individuIndex) {
        controller('FoyerRessourceTypesCtrl', {
            $scope: scope,
            $stateParams: { individu: individuIndex || 0 },
            ressourceTypes: _ressourceTypes_,
            ressourceCategories: _ressourceCategories_
        });
    };

    describe('initialization', function() {
        it('should index the ressource types by their category', function() {
            // given
            var ressourceTypes = [{ id: 'salaire', category: 'activite' }];
            var ressourceCategories = [{ id: 'activite' }];

            // when
            controller('FoyerRessourceTypesCtrl', {
                $scope: scope,
                $stateParams: { individu: 0 },
                ressourceTypes: ressourceTypes,
                ressourceCategories: ressourceCategories
            });

            // then
            expect(scope.ressourceTypesByCategories.activite[0].id).toEqual('salaire');
        });

        it('should omit pensions_alimentaires_versees_individu', function() {

            // when
            initController();

            var types = _.map(scope.ressourceTypesByCategories.pensions, 'id');
            expect(types).not.toContain('pensions_alimentaires_versees_individu');
        });
    });

    describe('function submit()', function() {
        beforeEach(function() {
            scope.individu = {};
        });

        it('should create a new ressource field in the view model', function() {
            // given
            initController();
            expect(scope.individu[_ressourceTypes_[0].id]).toBeFalsy();
            expect(scope.selectedRessourceTypes[_ressourceTypes_[0].id]).toBeFalsy();

            scope.selectedRessourceTypes[_ressourceTypes_[0].id] = true;
            // when
            scope.submit();

            // then
            expect(scope.individu[_ressourceTypes_[0].id]).toEqual({});
        });

        it('should delete unselected ressource types in the ressources view model', function() {
            // given
            scope.individu.chomage_net = {};
            initController();
            scope.selectedRessourceTypes = { chomage_net: false };

            // when
            scope.submit();

            // then
            expect(scope.individu.chomage_net).toBeFalsy();
            expect(scope.selectedRessourceTypes.chomage_net).toBe(undefined);
        });

        it('should keep previous ressource corresponding to the selected ressource type if it exists', function() {
            // given
            var ressource = {};
            ressource[month] = 42;
            scope.individu.chomage_net = ressource;
            scope.selectedRessourceTypes = { chomage_net: true };

            // when
            initController();
            scope.submit();

            // then
            expect(scope.individu.chomage_net).toBeTruthy();
        });
    });
});

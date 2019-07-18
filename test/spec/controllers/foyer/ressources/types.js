'use strict';

describe('Controller: FoyerRessourceTypesCtrl', function() {

    var scope, _ressourceTypes_, controller;

    beforeEach(function() {
        module('ddsApp');
        inject(function(ressourceTypes, $controller, $rootScope) {
            _ressourceTypes_ = ressourceTypes;
            controller = $controller;
            scope = $rootScope.$new();
        });

        scope.situation = { dateDeValeur: '2013-04-10' };
        scope.ressources = [];
        scope.declareNextIndividuResources = function() {};
    });

    var initController = function(individuIndex) {
        controller('FoyerRessourceTypesCtrl', {
            $scope: scope,
            $stateParams: { individu: individuIndex || 0 },
            ressourceTypes: _ressourceTypes_
        });
    };

    describe('initialization', function() {
        it('should index the ressource types by their category', function() {
            // given
            var ressourceTypes = [{ id: 'toto', category: 'tata' }];

            // when
            controller('FoyerRessourceTypesCtrl', {
                $scope: scope,
                $stateParams: { individu: 0 },
                ressourceTypes: ressourceTypes
            });

            // then
            expect(scope.ressourceTypesByCategories).toEqual({ tata: [ressourceTypes[0]]});
        });

        it('should omit the "pensions alimentaires" ressource type', function() {

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
            scope.selectedRessourceTypes = {};
            scope.selectedRessourceTypes[_ressourceTypes_[0].id] = true;

            expect(scope.individu[_ressourceTypes_[0].id]).toBeFalsy();

            // when
            scope.submit();

            // then
            expect(scope.individu[_ressourceTypes_[0].id]).toEqual({});
        });

        it('should delete unselected ressource types in the ressources view model', function() {
            // given
            scope.individu.pensions_alimentaires_versees_individu = {};
            initController();
            scope.selectedRessourceTypes = { pensions_alimentaires_versees_individu: false };

            // when
            scope.submit();

            // then
            expect(scope.individu.pensions_alimentaires_versees_individu).toBeFalsy();
            expect(scope.selectedRessourceTypes.pensions_alimentaires_versees_individu).toBe(undefined);
        });

        it('should keep previous ressource corresponding to the selected ressource type if it exists', function() {
            // given
            initController();
            scope.selectedRessourceTypes = {};
            scope.selectedRessourceTypes[_ressourceTypes_[0].id] = true;
            var ressource = { '2017-08': 42 };
            scope.individu[_ressourceTypes_[0].id] = ressource;

            // when
            scope.submit();

            // then
            expect(scope.individu[_ressourceTypes_[0].id]).toBe(ressource);
        });
    });
});

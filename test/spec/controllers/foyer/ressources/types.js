'use strict';

describe('Controller: FoyerRessourceTypesCtrl', function() {

    var scope, _ressourceTypes_, controller;

    beforeEach(function() {
        scope = {
            situation: { dateDeValeur: '2013-04-10' },
            ressources: [],
            declareNextIndividuResources: function() {},
        };
        module('ddsApp');
        inject(function(ressourceTypes, $controller) {
            _ressourceTypes_ = ressourceTypes;
            controller = $controller;
        });
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

        it('should create a new ressource field in the view model with montants equal to zero for each selected ressource', function() {
            // given
            initController();
            scope.selectedRessourceTypes = {};
            scope.selectedRessourceTypes[_ressourceTypes_[0].id] = true;

            // when
            scope.submit();

            // then
            expect(scope.ressources.length).toBe(1);
            expect(scope.ressources[0].type).toBe(_ressourceTypes_[0]);
            expect(scope.ressources[0].montantsMensuels).toEqual([0, 0, 0]);
            expect(scope.ressources[0].montantAnnuel).toBe(0);
        });

        it('should delete unselected ressource types in the ressources view model', function() {
            // given
            initController();
            scope.selectedRessourceTypes = { toto: false };

            // when
            scope.submit();

            // then
            expect(scope.ressources.length).toBe(0);
        });

        it('should keep previous ressource corresponding to the selected ressource type if it exists', function() {
            // given
            initController();
            scope.selectedRessourceTypes = {};
            scope.selectedRessourceTypes[_ressourceTypes_[0].id] = true;
            var ressource = {
                type: _ressourceTypes_[0],
                montantsMensuels: [100, 200, 300],
                montantAnnuel: 400
            };
            scope.ressources = [ressource];

            // when
            scope.submit();

            // then
            expect(scope.ressources.length).toBe(1);
            expect(scope.ressources[0]).toBe(ressource);
        });

        it('should inject the ressources in the view model ordering by the same order as the ressource types', function() {
            // given
            _ressourceTypes_ = [{ id: 'toto' }, { id: 'tata' }, { id: 'tutu' }];
            initController();
            scope.selectedRessourceTypes = { tutu: true, toto: true };

            // when
            scope.submit();

            // then
            expect(scope.ressources[0].type).toBe(_ressourceTypes_[0]);
            expect(scope.ressources[1].type).toBe(_ressourceTypes_[2]);
        });

        it('should delete ressources that are not selected anymore', function() {
            // given
            initController();
            scope.ressources = [{ id: _ressourceTypes_[0].id }];
            scope.selectedRessourceTypes = {};

            // when
            scope.submit();

            // then
            expect(scope.ressources.length).toBe(0);
        });
    });
});

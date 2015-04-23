'use strict';

/* global _ */

describe('Controller: FoyerRessourceTypesCtrl', function() {

    var scope, _ressourceTypes_, controller;

    beforeEach(function() {
        scope = {};
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
            scope.individusVM = [{ individu: { role: 'demandeur' }}];
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
            // given
            scope.individusVM = [{ individu: { role: 'demandeur' }}];

            // when
            initController();

            var types = _.pluck(scope.ressourceTypesByCategories.pensions, 'id');
            expect(types).not.toContain('pensionsAlimentairesVersees');
        });

        it('should set the page title to "Vos ressources" if individu is demandeur', function() {
            // given
            scope.individusVM = [{ individu: { role: 'demandeur' }}];

            // when
            initController();

            // then
            expect(scope.pageTitle).toBe('Vos ressources');
        });

        it('should set the page title to "Les ressources de votre conjoint" if individu is conjoint', function() {
            // given
            scope.individusVM = [{ individu: { role: 'conjoint' }}];

            // when
            initController();

            // then
            expect(scope.pageTitle).toBe('Les ressources de votre conjoint');
        });

        it('should set the page title to the first name if individu is not parent', function() {
            // given
            scope.individusVM = [{ individu: { role: 'enfant', firstName: 'Jérome' }}];

            // when
            initController();

            // then
            expect(scope.pageTitle).toBe('Les ressources de Jérome');
        });
    });

    describe('function submit()', function() {
        beforeEach(function() {
            scope.individusVM = [{ individu: {}, ressources: [] }];
        });

        it('should create a new ressource field in the view model with montants equal to zero for each selected ressource', function() {
            // given
            initController();
            scope.individuVM.selectedRessourceTypes = {};
            scope.individuVM.selectedRessourceTypes[_ressourceTypes_[0].id] = true;

            // when
            scope.submit();

            // then
            expect(scope.individuVM.ressources.length).toBe(1);
            expect(scope.individuVM.ressources[0].type).toBe(_ressourceTypes_[0]);
            expect(scope.individuVM.ressources[0].montantsMensuels).toEqual([0, 0, 0]);
            expect(scope.individuVM.ressources[0].montantAnnuel).toBe(0);
        });

        it('should delete unselected ressource types in the ressources view model', function() {
            // given
            initController();
            scope.individuVM.selectedRessourceTypes = { toto: false };

            // when
            scope.submit();

            // then
            expect(scope.individuVM.ressources.length).toBe(0);
        });

        it('should keep previous ressource corresponding to the selected ressource type if it exists', function() {
            // given
            initController();
            scope.individuVM.selectedRessourceTypes = {};
            scope.individuVM.selectedRessourceTypes[_ressourceTypes_[0].id] = true;
            var ressource = {
                type: _ressourceTypes_[0],
                montantsMensuels: [100, 200, 300],
                montantAnnuel: 400
            };
            scope.individuVM.ressources = [ressource];

            // when
            scope.submit();

            // then
            expect(scope.individuVM.ressources.length).toBe(1);
            expect(scope.individuVM.ressources[0]).toBe(ressource);
        });

        it('should inject the ressources in the view model ordering by the same order as the ressource types', function() {
            // given
            _ressourceTypes_ = [{ id: 'toto' }, { id: 'tata' }, { id: 'tutu' }];
            initController();
            scope.individuVM.selectedRessourceTypes = { tutu: true, toto: true };

            // when
            scope.submit();

            // then
            expect(scope.individuVM.ressources[0].type).toBe(_ressourceTypes_[0]);
            expect(scope.individuVM.ressources[1].type).toBe(_ressourceTypes_[2]);
        });

        it('should delete ressources that are not selected anymore', function() {
            // given
            initController();
            scope.individuVM.ressources = [{ id: _ressourceTypes_[0].id }];
            scope.individuVM.selectedRessourceTypes = {};

            // when
            scope.submit();

            // then
            expect(scope.individuVM.ressources.length).toBe(0);
        });

        it('should init micro-entreprises specific params when micro-entreprise is selected', function() {
            // given
            initController();
            scope.individuVM.ressources = [];
            scope.individuVM.selectedRessourceTypes = { 'caMicroEntreprise': true };

            // when
            scope.submit();

            // then
            expect(scope.individuVM.ressources[0].tnsActiviteType).toBe('bic');
            expect(scope.individuVM.ressources[0].montantsMensuels).toBeUndefined();
        });

        it('should init autres revenus tns params when it is selected', function() {
            // given
            initController();
            scope.individuVM.ressources = [];
            scope.individuVM.selectedRessourceTypes = { 'autresRevenusTns': true };

            // when
            scope.submit();

            // then
            expect(scope.individuVM.ressources[0].type.id).toBe('autresRevenusTns');
            expect(scope.individuVM.ressources[0].montantAnnuel).toBe(0);
        });
    });
});

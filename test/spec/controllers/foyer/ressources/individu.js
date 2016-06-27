'use strict';

describe('Controller: FoyerRessourcesIndividuCtrl', function() {

    var scope, demandeur, _ressourceTypes_, controller;

    beforeEach(function() {
        scope = {
            situation: { dateDeValeur: '2013-04-10' },
            sortedIndividus: [{ role: 'demandeur' }, { role: 'conjoint' }, { role: 'enfant', firstName: 'Jérome' }]
        };
        demandeur = scope.sortedIndividus[0];
        module('ddsApp');
        inject(function(ressourceTypes, $controller) {
            _ressourceTypes_ = ressourceTypes;
            controller = $controller;
        });
    });

    var initController = function(individuIndex) {
        controller('FoyerRessourcesIndividuCtrl', {
            $scope: scope,
            $stateParams: { individu: individuIndex || 0 },
            ressourceTypes: _ressourceTypes_
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

        it('should retrieve the selected ressource types in the selectedRessourceTypes map if individus have ressources', function() {

            // given
            demandeur.ressources = [{ type: 'stage' }, { type: 'revenusSalarie' }];

            // when
            initController();

            // then
            expect(scope.selectedRessourceTypes).toEqual({ revenusSalarie: true, stage: true });
        });

        it('should map the previous individu ressource amounts to the view model', function() {

            // given
            _ressourceTypes_ = [{ id: 'toto' }];
            demandeur.ressources = [
                { type: 'toto', periode: '2013-03', montant: 100 },
                { type: 'toto', periode: '2012-10', montant: 100 },
            ];

            // when
            initController();

            // then
            expect(scope.ressources.length).toBe(1);
            expect(scope.ressources[0].type).toBe(_ressourceTypes_[0]);
            expect(scope.ressources[0].montantsMensuels).toEqual([0, 0, 100]);
            expect(scope.ressources[0].montantAnnuel).toBe(200);
        });

        it('should not map pensions alimentaires versées to the view model', function() {

            // given
            demandeur.ressources = [
                { type: 'pensionsAlimentairesVersees', periode: '2012-10', montant: 100 },
            ];

            // when
            initController();

            // then
            expect(scope.ressources.length).toBe(0);
        });

        it('should round amounts when mapping individus ressources', function() {

            // given
            _ressourceTypes_ = [{ id: 'toto' }];
            demandeur.ressources = [
                { type: 'toto', periode: '2013-03', montant: 5.5 },
                { type: 'toto', periode: '2013-02', montant: 4.4 },
                { type: 'toto', periode: '2013-01', montant: 66.6 },
            ];

            // when
            initController();

            // then
            expect(scope.ressources.length).toBe(1);
            expect(scope.ressources[0].type).toBe(_ressourceTypes_[0]);
            expect(scope.ressources[0].montantsMensuels).toEqual([67, 4, 6]);
            expect(scope.ressources[0].montantAnnuel).toBe(77);
        });

        it('should not map unknown ressource types', function() {
            // given
            demandeur.ressources = [
                { type: 'unknown_ressource_type', periode: '2013-03', montant: 10 },
            ];

            // when
            initController();

            // then
            expect(scope.ressources.length).toBe(0);
        });

        it('should map ressources micro-entreprise', function() {

            // given
            demandeur.ressources = [{
                    type: 'caMicroEntreprise',
                    periode: '2014',
                    montant: 1000
                }];
            demandeur.tnsActiviteType = 'bnc';

            // when
            initController();

            // then
            var individuVM = scope;
            expect(individuVM.selectedRessourceTypes).toEqual({ caMicroEntreprise: true });
            var ressources = individuVM.ressources;
            expect(ressources.length).toBe(1);
            expect(ressources[0].type.id).toBe('caMicroEntreprise');
            expect(ressources[0].montantAnnuel).toBe(1000);
        });

        it('should map the "ongoing" attribute of each ressource', function() {
            // given
            _ressourceTypes_ = [{ id: 'foo' }, { id: 'bar' }];
            demandeur.ressources = [
                { type: 'foo', periode: '2013-03', montant: 10 },
                { type: 'bar', periode: '2013-03', montant: 10 },
            ];
            demandeur.interruptedRessources = ['foo'];

            // when
            initController();

            // then
            var ressources = scope.ressources;
            expect(ressources[0].type.id).toBe('foo');
            expect(ressources[0].onGoing).toBe(false);
            expect(ressources[1].type.id).toBe('bar');
            expect(ressources[1].onGoing).toBe(true);
        });
    });
});

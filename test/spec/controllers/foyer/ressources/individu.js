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
            demandeur.indemnites_stage = {};
            demandeur.salaire_net_hors_revenus_exceptionnels = {};

            // when
            initController();

            // then
            expect(scope.selectedRessourceTypes).toEqual({ salaire_net_hors_revenus_exceptionnels: true, indemnites_stage: true });
        });

        it('should not map pensions alimentaires versées to the view model', function() {

            // given
            demandeur.pensions_alimentaires_versees_individu = {
                '2012-10': 100,
            };

            // when
            initController();

            // then
            expect(scope.selectedRessourceTypes).toEqual({});
        });

        it('should map ressources micro-entreprise', function() {

            // given
            demandeur.tns_micro_entreprise_chiffre_affaires = {
                '2014': 1000
            };
            demandeur.tnsActiviteType = 'bnc';

            // when
            initController();

            // then
            var individuVM = scope;
            expect(individuVM.selectedRessourceTypes).toEqual({ tns_micro_entreprise_chiffre_affaires: true });
        });
    });
});

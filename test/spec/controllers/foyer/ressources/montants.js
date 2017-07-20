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
        inject(function(SituationService) {
            scope.months = SituationService.getMonths(scope.situation.dateDeValeur);
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

    describe('default ressource value generation', function() {
        it('should provide 4 zeros by default', function() {
            initControllerWithRessource('salaire_net_hors_revenus_exceptionnels');

            expect(scope.individu.salaire_net_hors_revenus_exceptionnels).toEqual({
                '2013-01': 0,
                '2013-02': 0,
                '2013-03': 0,
                '2013-04': 0,
            });
        });

        it('should provide 3 zeros for exceptionnal ressource', function() {
            initControllerWithRessource('primes_salaires_net');

            expect(scope.individu.primes_salaires_net).toEqual({
                '2013-01': 0,
                '2013-02': 0,
                '2013-03': 0,
            });
        });

        it('should provide 1 zero for annual ressource', function() {
            initControllerWithRessource('tns_micro_entreprise_chiffre_affaires');

            expect(scope.individu.tns_micro_entreprise_chiffre_affaires).toEqual({
                '2012': 0,
            });
        });

        it('should remove previous ressources of the individu', function() {
            var individu = {
                role: 'demandeur',
                salaire_net_hors_revenus_exceptionnels: {
                    '2013-03': 100,
                    '2013-04': 100,
                    '2013-05': 100,
                    '2013-06': 100,
                    '2013-07': 100,
                    '2013-08': 100,
                    '2013-09': 100,
                    '2013-10': 100,
                    '2013-11': 100,
                    '2013-12': 100,
                    '2014-01': 100,
                    '2014-02': 100,
                },
            };
            scope.individu = _.assign({}, individu);
            scope.selectedRessourceTypes = {
                salaire_net_hors_revenus_exceptionnels: {},
            };

            initController();
            expect(scope.individu.salaire_net_hors_revenus_exceptionnels).toEqual(individu.salaire_net_hors_revenus_exceptionnels);
        });
    });
});

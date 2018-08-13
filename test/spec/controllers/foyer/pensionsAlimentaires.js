'use strict';

describe('Controller: FoyerPensionsAlimentairesCtrl', function() {

    var scope, _ressourceTypes_;

    beforeEach(function() {
        scope = {
            $on: function() {},
            $emit: function() {},
            $watch: function() {},
            situation: { dateDeValeur: '2013-04-10' }
        };
        module('ddsApp');
        inject(function(ressourceTypes) {
            _ressourceTypes_ = ressourceTypes;
        });
    });

    var initController = function() {
        inject(function($controller) {
            $controller('FoyerPensionsAlimentairesCtrl', {
                $scope: scope,
                ressourceTypes: _ressourceTypes_
            });
        });
    };

    describe('initialization', function() {
        it('should create an empty view model for each parent with zero-filled amounts', function() {
            // given
            scope.situation.individus = [{ role: 'demandeur' }, { role: 'conjoint' }, { role: 'enfant' }];

            // when
            initController();

            // then
            expect(scope.locals.parentsPayPensionsAlimentaires).toBe(false);
        });

        it('should map previous pensions alimentaires', function() {
            // given
            scope.situation.individus = [{
                role: 'demandeur',
                pensions_alimentaires_versees_individu: {
                    '2013-01': 250,
                }
            }];

            // when
            initController();

            // then
            expect(scope.locals.parentsPayPensionsAlimentaires).toBe(true);
        });

        it('should remove pensions alimentaires', function() {
            // given
            scope.situation.individus = [{
                role: 'demandeur',
                pensions_alimentaires_versees_individu: {
                    '2013-01': 250,
                }
            }];

            // when
            initController();
            scope.locals.parentsPayPensionsAlimentaires = false;
            scope._parentsPayPensionsAlimentairesUpdated();

            // then
            expect(scope.situation.individus[0].pensions_alimentaires_versees_individu).toBeFalsy();
        });
    });
});

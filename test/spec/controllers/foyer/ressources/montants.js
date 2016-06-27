'use strict';

/* global _ */

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

    describe('function submit()', function() {
        it('should apply ressource amounts to the individu model, flattened by month', function() {
            // given
            scope.individu = { role: 'demandeur' };
            initController();
            scope.ressources = [{
                type: { id: 'toto' },
                montantsMensuels: [100, 200, 300],
                montantAnnuel: 690
            }];

            // when
            scope.submit(form);

            // then
            expect(scope.individu.ressources.length).toBe(12);
            expect(scope.individu.ressources[0]).toEqual({ type: 'toto', periode: '2013-03', montant: 300 });
            expect(scope.individu.ressources[1]).toEqual({ type: 'toto', periode: '2013-02', montant: 200 });
            expect(scope.individu.ressources[2]).toEqual({ type: 'toto', periode: '2013-01', montant: 100 });
            expect(scope.individu.ressources[3]).toEqual({ type: 'toto', periode: '2012-12', montant: 10 });
            expect(scope.individu.ressources[11]).toEqual({ type: 'toto', periode: '2012-04', montant: 10 });
        });

        it('should remove previous ressources of the individu', function() {
            scope.individu = {
                role: 'demandeur',
                ressources: [
                    { periode: '2013-03', type: 'toto', montant: 133},
                    { periode: '2013-03', type: 'tata', montant: 122 }
                ]
            };
            initController();
            scope.ressources = [{
                type: { id: 'toto' },
                montantsMensuels: [100, 100, 100],
                montantAnnuel: 750
            }];

            // when
            scope.submit(form);

            // then
            expect(scope.individu.ressources.length).toBe(12);
            expect(_.where(scope.individu.ressources, { type: 'toto' }).length).toBe(12);
            expect(scope.individu.ressources[0].montant).toBe(100);
        });

        it('should keep ressources n-2 and pensions alimentaires as is', function() {
            // given
            var ressourceN2 = { type: 'rncRevenusActivite', montant: 200 };
            var pensionAlimentaireVersee = { type: 'pensionsAlimentairesVersees', montantAnnuel: 100 };
            scope.individu = { role: 'demandeur', ressources: [ressourceN2, pensionAlimentaireVersee] };
            scope.ressources  = [];
            initController();

            // when
            console.log('now!');
            scope.submit(form);

            // then
            expect(scope.individu.ressources).toEqual([ressourceN2, pensionAlimentaireVersee]);
        });

        it('should fill the interruptedRessources field of each individu with ressources declared as interrupted', function() {
            // given
            scope.individu = { role: 'demandeur' };
            initController();
            scope.ressources = [
                { type: { id: 'test' }, montantsMensuels: [], onGoing: true },
                { type: { id: 'test2' }, montantsMensuels: [], onGoing: false }
            ];

            // when
            scope.submit(form);

            // then
            expect(scope.individu.interruptedRessources.length).toBe(1);
            expect(scope.individu.interruptedRessources[0]).toEqual('test2');
        });

        it('should save the "autres revenus professionnels" in ressources', function() {
            // given
            scope.individu = { role: 'demandeur' };
            initController();
            var ressourceTypeAutreTns = _.find(_ressourceTypes_, { id: 'autresRevenusTns' });
            // scope.selectedRessourceTypes = { autresRevenusTns: true },
            scope.ressources = [
                        { type: ressourceTypeAutreTns, montantAnnuel: 100 }
                    ];

            // when
            scope.submit(form);
            var autresRevenusTns = _.find(scope.individu.ressources, function(ressource){
                return ressource.type == 'autresRevenusTns';
            });

            // then
            expect(autresRevenusTns).toBeDefined();
        });
    });
});

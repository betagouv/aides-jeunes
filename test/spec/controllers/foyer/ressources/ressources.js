'use strict';

/* global _ */

describe('Controller: FoyerRessourcesCtrl', function() {

    var scope, _ressourceTypes_, form;

    beforeEach(function() {
        scope = {
            $on: function() {},
            $emit: function() {},
            situation: { dateDeValeur: '2013-04-10' }
        };
        form = { $valid: true };
        module('ddsApp');
        inject(function(ressourceTypes) {
            _ressourceTypes_ = ressourceTypes;
        });
    });

    var initController = function() {
        inject(function($controller) {
            $controller('FoyerRessourcesCtrl', {
                $scope: scope,
                ressourceTypes: _ressourceTypes_
            });
        });
    };

    describe('initialization', function() {
        it('should create an individus view model containing their label, an empty selected ressources map and an empty ressources array', function() {
            // given
            scope.situation.individus = [{ role: 'demandeur' }, { role: 'conjoint' }];

            // when
            initController();

            // then
            expect(scope.individusVM[0].selectedRessourceTypes).toEqual({});
            expect(scope.individusVM[1].selectedRessourceTypes).toEqual({});
            expect(scope.individusVM[0].label).toBe('Vous');
            expect(scope.individusVM[0].ressources.length).toBe(0);
        });

        it('should retrieve the selected ressource types in the selectedRessourceTypes map if individus have ressources', function() {
            // given
            scope.situation.individus = [
                { ressources: [{ type: 'revenusSalarie' }] },
                { ressources: [{ type: 'stage' }, { type: 'revenusSalarie' }] },
                { ressources: [] }
            ];

            // when
            initController();

            // then
            expect(scope.individusVM[0].selectedRessourceTypes).toEqual({ revenusSalarie: true});
            expect(scope.individusVM[1].selectedRessourceTypes).toEqual({ revenusSalarie: true, stage: true });
            expect(scope.individusVM[2].selectedRessourceTypes).toEqual({});
        });

        it('should map the previous individu ressource amounts to the view model', function() {
            // given
            _ressourceTypes_ = [{ id: 'toto' }];
            scope.situation.individus = [{
                ressources: [
                    { type: 'toto', periode: '2013-03', montant: 100 },
                    { type: 'toto', periode: '2012-10', montant: 100 },
                ]
            }];

            // when
            initController();

            // then
            expect(scope.individusVM[0].ressources.length).toBe(1);
            expect(scope.individusVM[0].ressources[0].type).toBe(_ressourceTypes_[0]);
            expect(scope.individusVM[0].ressources[0].montantsMensuels).toEqual([0, 0, 100]);
            expect(scope.individusVM[0].ressources[0].montantAnnuel).toBe(200);
        });

        it('should not map pensions alimentaires versées to the view model', function() {
            // given
            scope.situation.individus = [{
                ressources: [
                    { type: 'pensionsAlimentairesVersees', periode: '2012-10', montant: 100 },
                ]
            }];

            // when
            initController();

            // then
            expect(scope.individusVM[0].ressources.length).toBe(0);
        });

        it('should round amounts when mapping individus ressources', function() {
            // given
            _ressourceTypes_ = [{ id: 'toto' }];
            scope.situation.individus = [{
                ressources: [
                    { type: 'toto', periode: '2013-03', montant: 5.5 },
                    { type: 'toto', periode: '2013-02', montant: 4.4 },
                    { type: 'toto', periode: '2013-01', montant: 66.6 },
                ]
            }];

            // when
            initController();

            // then
            expect(scope.individusVM[0].ressources.length).toBe(1);
            expect(scope.individusVM[0].ressources[0].type).toBe(_ressourceTypes_[0]);
            expect(scope.individusVM[0].ressources[0].montantsMensuels).toEqual([67, 4, 6]);
            expect(scope.individusVM[0].ressources[0].montantAnnuel).toBe(77);
        });

        it('should not map unknown ressource types', function() {
            // given
            scope.situation.individus = [{
                ressources: [
                    { type: 'unknown_ressource_type', periode: '2013-03', montant: 10 },
                ]
            }];

            // when
            initController();

            // then
            expect(scope.individusVM[0].ressources.length).toBe(0);
        });

        it('should map ressources micro TNS', function() {
            // given
            scope.situation.individus = [{
                tnsStructureType: 'auto_entrepreneur',
                tnsActiviteType: 'bnc',
                caMicroEntreprise: 1000
            }];

            // when
            initController();

            // then
            var individuVM = scope.individusVM[0];
            expect(individuVM.selectedRessourceTypes).toEqual({ caMicroEntreprise: true });
            var ressources = individuVM.ressources;
            expect(ressources.length).toBe(1);
            expect(ressources[0].type.id).toBe('caMicroEntreprise');
            expect(ressources[0].montantAnnuel).toBe(1000);
        });

        it('should map ressources autres revenus TNS', function() {
            // given
            scope.situation.individus = [{
                autresRevenusTns: 1000
            }];

            // when
            initController();

            // then
            var individuVM = scope.individusVM[0];
            expect(individuVM.selectedRessourceTypes).toEqual({ autresRevenusTns: true });
            var ressources = individuVM.ressources;
            expect(ressources.length).toBe(1);
            expect(ressources[0].type.id).toBe('autresRevenusTns');
            expect(ressources[0].montantAnnuel).toBe(1000);
        });

        it('should map the "ongoing" attribute of each ressource', function() {
            // given
            _ressourceTypes_ = [{ id: 'foo' }, { id: 'bar' }];
            scope.situation.individus = [{
                ressources: [
                    { type: 'foo', periode: '2013-03', montant: 10 },
                    { type: 'bar', periode: '2013-03', montant: 10 },
                ],
                interruptedRessources: ['foo']
            }];

            // when
            initController();

            // then
            var ressources = scope.individusVM[0].ressources;
            expect(ressources[0].type.id).toBe('foo');
            expect(ressources[0].onGoing).toBe(false);
            expect(ressources[1].type.id).toBe('bar');
            expect(ressources[1].onGoing).toBe(true);
        });
    });

    describe('function submit()', function() {
        it('should apply ressource amounts to the individu model, flattened by month', function() {
            // given
            var individu = {};
            scope.situation.individus = [individu];
            initController();
            scope.individusVM[0].ressources = [{
                type: { id: 'toto' },
                montantsMensuels: [100, 200, 300],
                montantAnnuel: 690
            }];

            // when
            scope.submit(form);

            // then
            expect(individu.ressources.length).toBe(12);
            expect(individu.ressources[0]).toEqual({ type: 'toto', periode: '2013-03', montant: 300 });
            expect(individu.ressources[1]).toEqual({ type: 'toto', periode: '2013-02', montant: 200 });
            expect(individu.ressources[2]).toEqual({ type: 'toto', periode: '2013-01', montant: 100 });
            expect(individu.ressources[3]).toEqual({ type: 'toto', periode: '2012-12', montant: 10 });
            expect(individu.ressources[11]).toEqual({ type: 'toto', periode: '2012-04', montant: 10 });
        });

        it('should remove previous ressources of the individu', function() {
            var individu = {
                ressources: [
                    { periode: '2013-03', type: 'toto', montant: 133},
                    { periode: '2013-03', type: 'tata', montant: 122 }
                ]
            };
            scope.situation.individus = [individu];
            initController();
            scope.individusVM[0].ressources = [{
                type: { id: 'toto' },
                montantsMensuels: [100, 100, 100],
                montantAnnuel: 750
            }];

            // when
            scope.submit(form);

            // then
            expect(individu.ressources.length).toBe(12);
            expect(_.where(individu.ressources, { type: 'toto' }).length).toBe(12);
            expect(individu.ressources[0].montant).toBe(100);
        });

        it('should keep ressources n-2 and pensions alimentaires as is', function() {
            // given
            var ressourceN2 = { type: 'rncRevenusActivite', montant: 200 };
            var pensionAlimentaireVersee = { type: 'pensionsAlimentairesVersees', montantAnnuel: 100 };
            scope.situation.individus = [{ ressources: [ressourceN2, pensionAlimentaireVersee] }];
            initController();

            // when
            scope.submit(form);

            // then
            expect(scope.situation.individus[0].ressources).toEqual([ressourceN2, pensionAlimentaireVersee]);
        });

        it('should fill the interruptedRessources field of each individu with ressources declared as interrupted', function() {
            // given
            initController();
            var individu = {};
            scope.individusVM = [
                {
                    individu: individu,
                    ressources: [
                        { type: { id: 'test' }, montantsMensuels: [], onGoing: true },
                        { type: { id: 'test2' }, montantsMensuels: [], onGoing: false }
                    ]
                }
            ];

            // when
            scope.submit(form);

            // then
            expect(individu.interruptedRessources.length).toBe(1);
            expect(individu.interruptedRessources[0]).toEqual('test2');
        });

        it('devrait sauvegarder les "autres revenus TNS" directement sur l\'individu', function() {
            // given
            initController();
            var ressourceTypeAutreTns = _.find(_ressourceTypes_, { id: 'autresRevenusTns' });
            var individu = {};
            scope.individusVM = [
                {
                    individu: individu,
                    selectedRessourceTypes: { autresRevenusTns: true },
                    ressources: [
                        { type: ressourceTypeAutreTns, montantAnnuel: 100 }
                    ]
                }
            ];

            // when
            scope.submit(form);

            // then
            expect(individu.autresRevenusTns).toBe(100);
        });

        it('devrait sauvegarder les revenus de micro-entreprise sur l\'individu', function() {
            initController();
            var ressourceTypeMicroTns = _.find(_ressourceTypes_, { id: 'caMicroEntreprise' });
            var individu = {};
            scope.individusVM = [
                {
                    individu: individu,
                    selectedRessourceTypes: { caMicroEntreprise: true },
                    ressources: [
                        {
                            type: ressourceTypeMicroTns,
                            tnsActiviteType: 'bnc',
                            montantAnnuel: 100
                        }
                    ]
                }
            ];

            // when
            scope.submit(form);

            // then
            expect(individu.caMicroEntreprise).toBe(100);
            expect(individu.microEntrepriseActiviteType).toBe('bnc');
        });

        it('devrait mettre à null les revenus tns si désélectionnés', function() {
            // given
            scope.situation.individus = [{ caMicroEntreprise: 1000, autresRevenusTns: 1000 }];
            initController();
            scope.individusVM[0].selectedRessourceTypes = {};

            // when
            scope.submit(form);

            // then
            expect(scope.individusVM[0].individu.caMicroEntreprise).toBe(null);
            expect(scope.individusVM[0].individu.autresRevenusTns).toBe(null);
        });

        it('should emit the "ressourcesUpdated" event', function() {
            // given
            initController();
            spyOn(scope, '$emit');

            // when
            scope.submit(form);

            // then
            expect(scope.$emit).toHaveBeenCalledWith('ressources');
        });
    });
});

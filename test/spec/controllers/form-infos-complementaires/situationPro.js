'use strict';

/* global _ */

describe('Controller: FormInfosComplementairesSituationProCtrl', function() {

    var scope;

    beforeEach(function() {
        module('ddsApp');
        scope = {};
    });

    describe('initialization', function() {
        it('Should create an array of individus references containing id and label of the demandeur and its conjoint if defined', function() {
            // when
            inject(function($controller) {
                $controller('FormInfosComplementairesSituationProCtrl', {$scope: scope, situation: {demandeur: {}, conjoint: {}}});
            });

            // then
            expect(scope.individusRef.length).toBe(2);
            expect(scope.individusRef[1].id).toBe('conjoint');
            expect(scope.individusRef[1].label).toBeDefined();
        });

        it('Should create an array of individus containing id and label of the demandeur only if no conjoint', function() {
            // when
            inject(function($controller) {
                $controller('FormInfosComplementairesSituationProCtrl', {$scope: scope, situation: {demandeur: {}}});
            });

            // then
            expect(scope.individusRef.length).toBe(1);
            expect(scope.individusRef[0].id).toBe('demandeur');
            expect(scope.individusRef[0].label).toBeDefined();
        });

        it('Should init each situation as not selected for each individu', function() {
            // given
            var situation = {demandeur: {}, conjoint: {}};

            // when
            inject(function($controller) {
                $controller('FormInfosComplementairesSituationProCtrl', {$scope: scope, situation: situation});
            });

            // then
            expect(scope.individusRef[0].situationsPro.length).toBe(scope.situationsPro.length);
            expect(_.filter(scope.individusRef[0].situationsPro, 'selected').length).toBe(0);
            expect(scope.individusRef[1].situationsPro.length).toBe(scope.situationsPro.length);
            expect(_.filter(scope.individusRef[1].situationsPro, 'selected').length).toBe(0);
        });
    });

    describe('function submit()', function() {
        var situation, SituationService;

        beforeEach(function() {
            situation = {demandeur: {}, conjoint: {}};
            inject(function($controller, _SituationService_) {
                SituationService = _SituationService_;
                spyOn(SituationService, 'update').andReturn({then: function() {}});
                $controller('FormInfosComplementairesSituationProCtrl', {
                    $scope: scope,
                    SituationService: SituationService,
                    situation: situation
                });
            });
        });

        it('Should append selected situations to each individu', function() {
            // given
            scope.individusRef[0].situationsPro[3].selected = true;

            // when
            scope.submit();

            // then
            expect(situation.demandeur.situationsPro.length).toBe(1);
            expect(situation.demandeur.situationsPro[0]).toBe(scope.individusRef[0].situationsPro[3]);
        });

        it('Should update the situation', function() {
            // when
            scope.submit();

            // then
            expect(SituationService.update).toHaveBeenCalledWith(situation);
        });
    });
});

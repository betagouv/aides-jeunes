'use strict';

describe('Controller: FormInfosComplementairesSituationProCtrl', function() {

    var scope;

    beforeEach(function() {
        module('ddsApp');
        scope = {};
    });

    describe('initialization', function() {
        var demandeur, conjoint;

        beforeEach(function() {
            demandeur = {};
            conjoint = {};
            inject(function($controller) {
                $controller('FormInfosComplementairesSituationProCtrl', {$scope: scope, situation: {demandeur: demandeur, conjoint: conjoint}});
            });
        });

        it('Should create an array of individus containing infos on the demandeur and its conjoint if defined', function() {
            // then
            expect(scope.individus.length).toBe(2);
            expect(scope.individus[1].id).toBe('conjoint');
            expect(scope.individus[1].label).toBeDefined();
        });

        it('Should create an array of individus containing infos only on the demandeur if no conjoint', function() {
            // when
            inject(function($controller) {
                $controller('FormInfosComplementairesSituationProCtrl', {$scope: scope, situation: {demandeur: demandeur}});
            });

            // then
            expect(scope.individus.length).toBe(1);
            expect(scope.individus[0].id).toBe('demandeur');
            expect(scope.individus[0].label).toBeDefined();
        });

        it('Should create a map of selected situations for each individu', function() {
            // then
            expect(scope.selectedSituations.demandeur).toEqual({});
            expect(scope.selectedSituations.conjoint).toEqual({});
        });

        it('Should create a map of dates for selected situations', function() {
            // then
            expect(scope.datesSelectedSituations.demandeur).toEqual({});
            expect(scope.datesSelectedSituations.conjoint).toEqual({});
        });
    });

    describe('function submit()', function() {
        var situation, demandeur, conjoint, SituationService;

        beforeEach(function() {
            demandeur = {};
            conjoint = {};
            situation = {demandeur: demandeur, conjoint: conjoint};

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

        it('Should save selected situations as an array into each individu object', function() {
            // given
            scope.selectedSituations.demandeur.situation1 = true;
            scope.selectedSituations.demandeur.situation2 = false;
            scope.selectedSituations.conjoint.situation3 = true;
            scope.datesSelectedSituations.demandeur.situation1 = '14/09/1989';
            scope.datesSelectedSituations.demandeur.situation2 = '15/09/1989';
            scope.datesSelectedSituations.conjoint.situation3 = '16/09/1989';

            // when
            scope.submit();

            // then
            expect(demandeur.situationsPro.length).toBe(1);
            expect(demandeur.situationsPro[0].situation).toBe('situation1');
            expect(demandeur.situationsPro[0].since).toBe('14/09/1989');
            expect(conjoint.situationsPro.length).toBe(1);
            expect(conjoint.situationsPro[0].situation).toBe('situation3');
            expect(conjoint.situationsPro[0].since).toBe('16/09/1989');
        });

        it('Should save the "activite cessee volontairement" field for the special case of "sans activite" situation', function() {
            // given
            scope.selectedSituations.demandeur.sans_activite = true;
            scope.isActiviteCesseeVolontairement.demandeur = true;

            // when
            scope.submit();

            // then
            expect(demandeur.situationsPro[0].volontairementSansActivite).toBe(true);
        });

        it('Should save the contract type for the special case of "salarie" situation', function() {
            // given
            scope.selectedSituations.demandeur.salarie = true;
            scope.salarieContractTypes.demandeur = 'cdi';

            // when
            scope.submit();

            // then
            expect(demandeur.situationsPro[0].contractType).toBe('cdi');
        });

        it('Should save the "is payed" field for the special case of "stagiaire" situation', function() {
            // given
            scope.selectedSituations.demandeur.stagiaire = true;
            scope.isStagiaireRemunere.demandeur = true;

            // when
            scope.submit();

            // then
            expect(demandeur.situationsPro[0].isRemunere).toBe(true);
        });

        it('Should save the "is indemnise" and "indemnise since" fields for the special case of "demandeur d\'emploi" situation', function() {
            // given
            scope.selectedSituations.demandeur.demandeur_emploi = true;
            scope.isChomeurIndemnise.demandeur = true;
            scope.chomeurIndemniseSince.demandeur = '12/07/2012';

            // when
            scope.submit();

            // then
            expect(demandeur.situationsPro[0].isIndemnise).toBe(true);
            expect(demandeur.situationsPro[0].indemniseSince).toBe('12/07/2012');
        });

        it('Should update the situation', function() {
            // when
            scope.submit();

            // then
            expect(SituationService.update).toHaveBeenCalledWith(situation);
        });
    });
});

'use strict';

describe('directive capture-montant-ressource', function() {
    var $compile, $scope, RessourceService_;

    beforeEach(module('ddsApp'));

    beforeEach(inject(function(_$compile_, _$rootScope_, RessourceService) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        RessourceService_ = RessourceService;
    }));

    it('should be closed', function() {

        $scope.individu = { 'ressourceTypeId': {} };
        $scope.ressourceType = { id: 'ressourceTypeId', label: 'ressourceTypeLabel' };
        $scope.situation = {
            dateDeValeur: new Date('2018-12-10')
        };
        RessourceService_.setDefaultValueForCurrentYear($scope.situation.dateDeValeur,
            $scope.individu, $scope.ressourceType);
        $scope.form = { $setValidity: function() {} };
        $scope.individu['ressourceTypeId']['2018-06'] = 0.0001;

        var element = $compile( 
            '<capture-montant-ressource '
        + 'individu="individu" '
        + 'ressource-type="ressourceType" '
        + 'date-de-valeur="situation.dateDeValeur" '
        + 'form="form" />')($scope);

        $scope.$digest();

        expect(element.text().trim()).toContain('Sinon');
    });
});
'use strict';

angular.module('ddsApp').controller('FoyerPensionsAlimentairesCtrl', function($scope, ressourceTypes, SituationService, IndividuService, RessourceService) {

    $scope.debutAnneeGlissante = moment($scope.situation.dateDeValeur).subtract(1, 'years').format('MMMM YYYY');
    $scope.currentMonth = moment($scope.situation.dateDeValeur).format('MMMM YYYY');

    $scope.pensionsVersees = _.find(ressourceTypes, { id: 'pensions_alimentaires_versees_individu' });
    $scope.individuLabel = IndividuService.label;

    var demandeur = _.find($scope.situation.individus, { role: 'demandeur' });
    var conjoint = _.find($scope.situation.individus, { role: 'conjoint' });
    $scope.individus = [ demandeur ];
    if (conjoint) {
        $scope.individus.push(conjoint);
    }

    $scope.locals = {
        parentsPayPensionsAlimentaires: $scope.individus.reduce(function(accum, individu) {
            return accum || _.some(individu.pensions_alimentaires_versees_individu);
        }, false),
    };

    function parentsPayPensionsAlimentairesUpdated() {
        if ($scope.locals.parentsPayPensionsAlimentaires) {
            $scope.individus.forEach(function(individu) {
                RessourceService.setDefaultValueForCurrentYear($scope.situation.dateDeValeur, individu, $scope.pensionsVersees);
            });
            return;
        }

        $scope.individus.forEach(function(individu) {
            RessourceService.unsetForCurrentYear($scope.situation.dateDeValeur, individu, $scope.pensionsVersees);
        });
    }

    $scope._parentsPayPensionsAlimentairesUpdated = parentsPayPensionsAlimentairesUpdated; // exported for testing

    $scope.$watch('locals.parentsPayPensionsAlimentaires', parentsPayPensionsAlimentairesUpdated);

    $scope.submit = function(form) {
        form.submitted = true;
        if (form.$valid) {
            $scope.$emit('pensionsAlimentaires');
        }
    };
});

'use strict';

angular.module('ddsApp').controller('FoyerRessourcesMontantsCtrl', function($scope, $stateParams, ressourceTypes, categoriesRnc, RessourceService, IndividuService) {

    function applyRessourcesToIndividu () {
        var individu = $scope.individu;
        var previousRessources = individu.ressources;
        individu.ressources = [];
        individu.interruptedRessources = [];

        $scope.ressources.forEach(function(ressource) {
            // Ressources for which we have the last 3 months values
            if (ressource.type.category != 'rpns' || ressource.type.id == 'caAutoEntrepreneur') {
                RessourceService.spreadIndividuRessources(individu, $scope.months, ressource, $scope.situation.dateDeValeur);
            // Ressources for which we have only yearly values
            } else {
                RessourceService.applyYearlyRessource(individu, ressource, $scope.situation.dateDeValeur);
            }
        });

        // on réinjecte les ressources RNC & pensions alimentaires
        individu.ressources = individu.ressources.concat(_.where(previousRessources, function(ressource) {
            return !! _.find(categoriesRnc, { id: ressource.type }) || _.contains(['pensionsAlimentairesVersees'], ressource.type);
        }));
    };

    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract('years', 1);
    $scope.yearMoinsUn = moment($scope.situation.dateDeValeur).subtract('years', 1).format('YYYY');
    $scope.currentMonth = moment($scope.situation.dateDeValeur).format('MMMM YYYY');
    $scope.individuLabel = IndividuService.label($scope.individu);

    $scope.ressourceTypes = _.indexBy(ressourceTypes, 'id');
    $scope.isNumber = angular.isNumber;

    $scope.autoEntrepreneurOnGoingQuestion = function(individu, currentMonth) {
        var prefix = {
            'demandeur': 'Vous aurez',
            'conjoint': 'Votre conjoint aura',
            'enfant': individu.firstName + ' aura'
        }[individu.role];
        return prefix + ' un chiffre d’affaires non nul en ' + currentMonth + '.';
    };

    $scope.submit = function(form) {
        form.submitted = true;
        if (form.$valid) {
            applyRessourcesToIndividu();
            $scope.declareNextIndividuResources(parseInt($stateParams.individu));
        }
    };
});

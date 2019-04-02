'use strict';

// https://stackoverflow.com/a/22480938
function isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    return isVisible;
}

function countSelectedRessourceTypes(selectedRessourceTypes) {
    return _.reduce(selectedRessourceTypes, function(accumulator, value) {
        return true === value ? accumulator + 1 : accumulator;
    }, 0);
}

var elementWatcher;
var collapseObserver;

angular.module('ddsApp').controller('FoyerRessourceTypesCtrl', function($scope, $stateParams, ABTestingService, ressourceCategories, ressourceTypes, $state, RessourceService) {

    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract(1, 'years');
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');

    $scope.ressourceCategories = ressourceCategories;

    var keyedRessourceTypes = _.keyBy(ressourceTypes, 'id');
    var filteredRessourceTypes = _.filter(ressourceTypes, RessourceService.isRessourceOnMainScreen);
    $scope.ressourceTypesByCategories = _.groupBy(filteredRessourceTypes, 'category');
    $scope.selectedRessourceTypesCount = countSelectedRessourceTypes($scope.selectedRessourceTypes);

    var abtesting = ABTestingService.getEnvironment();
    $scope.hideHelp = abtesting && abtesting.resourceHelp && abtesting.resourceHelp.value === "Hide";

    $scope.isOpen = {
        'revenusActivite': true // If nothing is selected
    };
    _.each($scope.selectedRessourceTypes, function(isSelected, ressourceTypeId) {
        if (isSelected) {
            $scope.isOpen[keyedRessourceTypes[ressourceTypeId].category] = true;
        }
    });

    var handler = function() {
        var submitButton = document.getElementById('submit-button');
        if (! submitButton) {
            window.removeEventListener('scroll', listener);
            return;
        }

        if (isScrolledIntoView(document.getElementById('scroll-detector'))) {
            submitButton.classList.remove('submit-button-nav--sticky');
        } else {
            submitButton.classList.add('submit-button-nav--sticky');
        }
    }
    var listener = $scope.$apply.bind($scope, handler);
    window.addEventListener('scroll', listener);

    // We can't use $scope.$watch('selectedRessourceTypes'),
    // because the reference is untouched
    $scope.onSelectedRessourceTypesChanged = function() {
        $scope.selectedRessourceTypesCount = countSelectedRessourceTypes($scope.selectedRessourceTypes);
    };

    function updateIndividuRessources(individu, selectedRessourceTypes) {
        Object.keys(selectedRessourceTypes).forEach(function(ressourceTypeId) {
            if (selectedRessourceTypes[ressourceTypeId]) {
                individu[ressourceTypeId] = individu[ressourceTypeId] || {};
            } else {
                RessourceService.unsetForCurrentYear($scope.situation.dateDeValeur, individu, keyedRessourceTypes[ressourceTypeId]);
                delete selectedRessourceTypes[ressourceTypeId];
            }
        });
    }
    $scope._updateIndividuRessources = updateIndividuRessources;

    $scope.submit = function() {
        updateIndividuRessources($scope.individu, $scope.selectedRessourceTypes);
        if (_.some($scope.selectedRessourceTypes)) {
            $state.go('foyer.ressources.individu.montants');
        } else {
            $scope.individu.hasRessources = ! _.isEmpty($scope.selectedRessourceTypes);
            $scope.declareNextIndividuResources(parseInt($stateParams.individu));
        }
    };
});

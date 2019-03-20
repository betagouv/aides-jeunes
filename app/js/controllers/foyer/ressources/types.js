'use strict';

var scrollMonitor = require('scrollmonitor');

function countSelectedRessourceTypes(selectedRessourceTypes) {
    return _.reduce(selectedRessourceTypes, function(accumulator, value) {
        return true === value ? accumulator + 1 : accumulator;
    }, 0);
}

var elementWatcher;

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

    var $scrollDetector = document.getElementById('scroll-detector');
    if ($scrollDetector) {
        // We need to wait for page to be loaded before initializing scrollmonitor,
        // otherwise the element position may be wrong
        angular.element(function() {
            if (elementWatcher) {
                elementWatcher.destroy();
            }
            elementWatcher = scrollMonitor.create($scrollDetector);
            elementWatcher.stateChange(function() {
                if (this.isBelowViewport) {
                    document.getElementById('submit-button').classList.add('submit-button-nav--sticky');
                } else {
                    document.getElementById('submit-button').classList.remove('submit-button-nav--sticky');
                }
            });
            if (elementWatcher.isBelowViewport) {
                document.getElementById('submit-button').classList.add('submit-button-nav--sticky');
            }
        });
        angular.element($scrollDetector).on('$destroy', function() {
            elementWatcher.destroy();
        });
    }

    // We force scrollmonitor to refresh when accordions are toggled
    $scope.onClickHeading = function() {
        // FIXME Find a better way than setTimeout
        setTimeout(function() {
            elementWatcher.recalculateLocation();
            elementWatcher.update();
            elementWatcher.triggerCallbacks();
        }, 500);
    };

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

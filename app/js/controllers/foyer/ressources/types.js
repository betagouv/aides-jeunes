'use strict';

var Fuse = require('fuse.js');

angular.module('ddsApp').controller('FoyerRessourceTypesCtrl', function($scope, $stateParams, ABTestingService, ressourceCategories, ressourceTypes, $state, RessourceService) {

    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract(1, 'years');
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');

    $scope.ressourceCategories = ressourceCategories;

    var keyedRessourceTypes = _.keyBy(ressourceTypes, 'id');
    var filteredRessourceTypes = _.filter(ressourceTypes, RessourceService.isRessourceOnMainScreen);
    $scope.ressourceTypesByCategories = _.groupBy(filteredRessourceTypes, 'category');

    var fuseTypes = new Fuse(ressourceTypes, {
        keys: ['label'],
        id: 'id',
        minMatchCharLength: 2,
        threshold: 0.4,
    });

    var fuseCategories = new Fuse(ressourceCategories, {
        keys: ['label', 'help'],
        id: 'id',
        minMatchCharLength: 3,
        threshold: 0.4,
    });

    function updateSearchedRessources(searchString) {
        function isRessourceSearched(ressource) {
            return searchString == undefined || searchString == '' ||
            fuseTypes.search(searchString).includes(ressource.id) ||
            fuseCategories.search(searchString).includes(ressource.category);
        }

        $scope.ressourceTypesByCategories = _.groupBy(
            _.filter(filteredRessourceTypes, isRessourceSearched),
            'category'
        );

        $scope.ressourceCategories.forEach(c => c.isOpen = ($scope.ressourceTypesByCategories[c.id] != undefined));
    }
    $scope.$watch('searchString', updateSearchedRessources);

    var abtesting = ABTestingService.getEnvironment();
    $scope.hideHelp = abtesting && abtesting.ressourceHelp && abtesting.ressourceHelp.value === "Hide";
    $scope.hideSearch = abtesting && abtesting.ressourceSearch && abtesting.ressourceSearch.value === "Hide";

    $scope.shouldInitiallyOpen = function(category) {
        var selectedRessourceTypes = Object.keys($scope.selectedRessourceTypes);
        if (! selectedRessourceTypes.length) {
            return category.id == 'revenusActivite';
        }

        return _.some(selectedRessourceTypes, function(ressourceTypeId) {
            return keyedRessourceTypes[ressourceTypeId].category == category.id;
        });
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

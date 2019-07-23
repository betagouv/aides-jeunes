'use strict';

var Fuse = require('fuse.js');

angular.module('ddsApp').controller('FoyerRessourceTypesCtrl', function($analytics, $scope, $stateParams, ABTestingService, ressourceCategories, ressourceTypes, $state, RessourceService) {

    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract(1, 'years');
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');

    $scope.ressourceCategories = ressourceCategories;
    var keyedRessourceTypes = _.keyBy(ressourceTypes, 'id');
    var filteredRessourceTypes = _.filter(ressourceTypes, RessourceService.isRessourceOnMainScreen);
    $scope.ressourceTypesByCategories = _.groupBy(filteredRessourceTypes, 'category');

    var fuseOptions = {
        keys: ['label'],
        id: 'id',
        minMatchCharLength: 2,
        threshold: 0.4,
        distance: 1000
    };
    var fuseTypes = new Fuse(ressourceTypes, fuseOptions);
    var fuseCategories = new Fuse(ressourceCategories, fuseOptions);

    function updateSearchedRessources(searchString) {
        function isRessourceSearched(ressource) {
            return searchString.length == 0 ||
                fuseTypes.search(searchString).includes(ressource.id) ||
                fuseCategories.search(searchString).includes(ressource.category);
        }

        if (searchString != undefined) {
            if (searchString.length > 0) {
                $scope.ressourceTypesByCategories = _.groupBy(
                    _.filter(filteredRessourceTypes, isRessourceSearched),
                    'category'
                );

                $scope.ressourceCategories.forEach(function(c) {
                    c.isOpen = ($scope.ressourceTypesByCategories[c.id] != undefined);
                });

                $analytics.eventTrack('update', { category: 'Search', label: $scope.searchString });
            } else {
                $scope.ressourceCategories.forEach(c => c.isOpen = $scope.shouldInitiallyOpen(c));
            }
        }
    }
    $scope.$watch('searchString', updateSearchedRessources);

    $scope.noResult = function() {
        var noResult = Object.keys($scope.ressourceTypesByCategories).length == 0;
        if (noResult) {
            $analytics.eventTrack('noResult', { category: 'Search', label: $scope.searchString });
            return true;
        } else {
            return false;
        }
    };

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

    $scope.countSelectedRessourceTypes = function() {
        var count = _.reduce($scope.selectedRessourceTypes, function(accumulator, value) {
            return true === value ? accumulator + 1 : accumulator;
        }, 0);
        var phrase = (count == 0 || count == 1) ? ' ressource sélectionnée' : ' ressources sélectionnées';
        $scope.selectedRessourceTypesCount = count.toString() + phrase;
    };
    $scope.countSelectedRessourceTypes();

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

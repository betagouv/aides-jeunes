'use strict';

var Fuse = require('fuse.js');

angular.module('ddsApp').controller('FoyerRessourceTypesCtrl', function($analytics, $scope, $stateParams, ABTestingService, ressourceCategories, ressourceTypes, $state, RessourceService) {
    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract(1, 'years');
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');

    var categories = ressourceCategories.map(function(c, i) {
        return Object.assign({}, c, { index: i, ressources: [], score: i });
    });
    var categoryMap = _.keyBy(categories, 'id');
    var types = _.filter(ressourceTypes, RessourceService.isRessourceOnMainScreen).map(function(t0) {
        var t = Object.assign({}, t0, {
            categoryId: t0.category,
            category: categoryMap[t0.category]
        });
        categoryMap[t0.category].ressources.push(t);
        return t;
    });
    var typeMap = _.keyBy(types, 'id');

    $scope.ressourceCategories = categories;
    $scope.ressourceTypesByCategories = _.groupBy(types, 'categoryId');
    var fuseOptions = {
        keys: [{
            name: 'label',
            weight: 1
        }, {
            name: 'category.label',
            weight: 0.5
        }],
        minMatchCharLength: 2,
        threshold: 0.4,
        distance: 1000,
        includeScore: true,
    };
    var fuseSearch = (new Fuse(types, fuseOptions));

    function updateSearchedRessources() {
        var searchString = $scope.searchString;
        var useFuse = (searchString && searchString.length);
        var typeMatches = useFuse ? fuseSearch.search(searchString).map(t => {
            t.item.score = t.score;
            return t.item;
        }) : types;

        $scope.ressourceTypesByCategories = _.groupBy(
            typeMatches,
            'categoryId'
        );

        $scope.ressourceCategories.forEach(function(c) {
            var ressources = $scope.ressourceTypesByCategories[c.id] || [];
            c.isOpen = ressources.length > 0;

            var minRessource = _.minBy(ressources, function(r) { return r.score; });
            c.score = (useFuse && minRessource) ? minRessource.score : c.index;
        });

        $scope.zeroMatches = Object.keys($scope.ressourceTypesByCategories).length == 0;
        if ($scope.zeroMatches) {
            $analytics.eventTrack('noResult', { category: 'Search', label: $scope.searchString });
        }
    }
    $scope.updateSearchedRessources = updateSearchedRessources;

    var abtesting = ABTestingService.getEnvironment();
    $scope.hideSearch = abtesting && abtesting.resourceSearch && abtesting.resourceSearch.value === "Hide";

    $scope.shouldInitiallyOpen = function(category) {
        var selectedRessourceTypes = Object.keys($scope.selectedRessourceTypes);
        if (! selectedRessourceTypes.length) {
            return category.id == 'revenusActivite';
        }

        return _.some(selectedRessourceTypes, function(ressourceTypeId) {
            return typeMap[ressourceTypeId].categoryId == category.id;
        });
    };

    $scope.selectedRessourceTypesCountLabel = function() {
        var count = _.reduce($scope.selectedRessourceTypes, function(accumulator, value) {
            return true === value ? accumulator + 1 : accumulator;
        }, 0);

        return count.toString() + ' ' + (count == 1 ? 'ressource sélectionnée' : 'ressources sélectionnées');
    };

    function updateIndividuRessources(individu, selectedRessourceTypes) {
        Object.keys(selectedRessourceTypes).forEach(function(ressourceTypeId) {
            if (selectedRessourceTypes[ressourceTypeId]) {
                individu[ressourceTypeId] = individu[ressourceTypeId] || {};
            } else {
                RessourceService.unsetForCurrentYear($scope.situation.dateDeValeur, individu, typeMap[ressourceTypeId]);
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

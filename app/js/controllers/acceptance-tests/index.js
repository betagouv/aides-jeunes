'use strict';

angular.module('acceptanceTests').controller('IndexCtrl', function($scope, $state, $timeout, AcceptanceTestsService, acceptanceTests, keywords, organizations, states, activities) {
    $scope.tests = acceptanceTests;

    $scope.activities = activities;

    $scope.keywords = keywords;
    $scope.selectedKeywords = [];

    $scope.organizations = organizations;
    $scope.selectedOrganizations = {};

    $scope.states = states;
    $scope.selectedStates = {};

    $scope.tabs = [
        { heading: 'Liste des tests', route:'index.list' },
        { heading: 'Timeline', route:'index.timeline' },
        { heading: 'Statistiques', route:'index.stats' }
    ];

    var extractSelectedFilters = function(selection) {
        return _.chain(selection).keys().filter(function(current) {
            return selection[current];
        }).value();
    };

    $scope.validate = function() {
        AcceptanceTestsService.get({
            keyword: $scope.selectedKeywords,
            organization: extractSelectedFilters($scope.selectedOrganizations),
            state: extractSelectedFilters($scope.selectedStates)
        }).then(function(result) {
            $scope.tests = result;
        });
    };

    $scope.setWaiting = function(tab) {
        if (!$scope.active(tab.route)) {
            tab.waiting = true;
        }
    };

    $scope.active = function(route) {
        return $state.is(route);
    };

    $scope.$on('stopWaiting', function() {
        $scope.tabs.forEach(function(tab) {
            tab.waiting = false;
        });
    });

    $scope.$on('$stateChangeSuccess', function() {
        $scope.tabs.forEach(function(tab) {
            tab.active = $scope.active(tab.route);
        });
    });
});


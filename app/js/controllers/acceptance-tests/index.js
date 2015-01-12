'use strict';

angular.module('acceptanceTests').controller('IndexCtrl', function($scope, $state, $stateParams, $timeout, AcceptanceTestsService, UserService, acceptanceTests, keywords, organizations, states, activities) {
    $scope.tests = acceptanceTests;
    $scope.activities = activities;

    $scope.keywords = keywords;
    $scope.selectedKeywords = ($stateParams.keyword) ? $stateParams.keyword : [];

    var toFilterObj = function(filterArray) {
        var filterObj = {};
        if (!_.isArray(filterArray)) {
            filterObj[filterArray] = true;
        } else {
            _.forEach(filterArray, function(filter) {
                filterObj[filter] = true;
            });
        }
        return filterObj;
    };

    $scope.organizations = organizations;
    $scope.selectedOrganizations = ($stateParams.organization) ? toFilterObj($stateParams.organization) : {};

    $scope.states = states;
    $scope.selectedStates = ($stateParams.state) ? toFilterObj($stateParams.state) : {};

    $scope.user = UserService.user();

    $scope.tabs = [
        { heading: 'Liste des tests', route:'index.list' } /*,
        { heading: 'Timeline', route:'index.timeline' },
        { heading: 'Statistiques', route:'index.stats' } */
    ];

    var extractSelectedFilters = function(selection) {
        return _.chain(selection).keys().filter(function(current) {
            return selection[current];
        }).value();
    };

    $scope.validate = function() {
        var filters = {
            keyword: $scope.selectedKeywords,
            organization: extractSelectedFilters($scope.selectedOrganizations),
            state: extractSelectedFilters($scope.selectedStates)
        };

        $state.go('index.list', filters);
    };

    $scope.setWaiting = function(tab) {
        if (!$scope.active(tab.route)) {
            tab.waiting = true;
        }
    };

    $scope.active = function(route) {
        return $state.is(route);
    };

    $scope.launchTests = function() {
        $scope.pendingTests = $scope.tests.length;
        $scope.tests.forEach(function(test) {
            AcceptanceTestsService.launchTest(test)
                .finally(function() {
                    $scope.pendingTests--;
                });
        });
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


'use strict';

angular.module('acceptanceTests').controller('IndexCtrl', function($scope, $state, $stateParams, $timeout, AcceptanceTestsService, UserService, keywords, organizations, states, activities) {
    $scope.activities = activities;

    $scope.keywords = keywords;

    if ($stateParams.keyword) {
        if (_.isArray($stateParams.keyword)) {
            $scope.selectedKeywords = $stateParams.keyword;
        } else {
            $scope.selectedKeywords = [$stateParams.keyword];
        }
    } else {
        $scope.selectedKeywords = [];
    }

    var toFilterObj = function(filterArray) {
        if (!_.isArray(filterArray)) {
            return { filterArray: true };
        } else {
            var filterObj = {};
            _.forEach(filterArray, function(filter) {
                filterObj[filter] = true;
            });
            return filterObj;
        }
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

        $state.go('index.list', filters, { reload: true });
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


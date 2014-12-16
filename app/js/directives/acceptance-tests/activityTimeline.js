'use strict';

angular.module('acceptanceTests').directive('activityTimeline', function() {
    return {
        restrict: 'E',
        templateUrl: '/acceptance-tests/partials/activityTimeline.html',
        scope: {
            activities: '=',
            showTarget: '='
        },
        controller: function($scope) {
            $scope.getActivityIcon = function(activity) {
                return activity.type.icon;
            };

            $scope.getDate = function(activity) {
                return moment(activity.date).fromNow();
            };
        }
    };
});

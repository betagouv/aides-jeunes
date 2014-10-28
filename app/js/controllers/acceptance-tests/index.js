'use strict';

angular.module('acceptanceTests').controller('IndexCtrl', function($scope, $state) {
    $scope.tabs = [
        { heading: 'Tous', route:'index.all', active:false },
        { heading: 'Valides', route:'index.validated', active:false },
        { heading: 'Mes tests', route:'index.mine', active:false }
    ];

    $scope.go = function(route){
        $state.go(route);
    };
 
    $scope.active = function(route){
        return $state.is(route);
    };
 
    $scope.$on('$stateChangeSuccess', function() {
        $scope.tabs.forEach(function(tab) {
            tab.active = $scope.active(tab.route);
        });
    });
});

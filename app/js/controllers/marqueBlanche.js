'use strict';

angular.module('ddsApp').controller('MarqueBlancheCtrl', function ($scope, $window, $sessionStorage, $timeout) {
    if ($window.location.pathname.indexOf('/secours-populaire/') === 0) {
        $scope.logo = 'logo_secours_populaire.png';
    }

    $scope.$storage = $sessionStorage;

    angular.element(document).ready(function() {
      $timeout(function() {
        $scope.showIntro = !$scope.$storage.hideIntro;
      }, 500);
    });

    $scope.hideIntro = function() {
      $scope.showIntro = false;
      $scope.$storage.hideIntro = true;
    };
});

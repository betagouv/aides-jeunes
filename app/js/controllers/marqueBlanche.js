'use strict';

angular.module('ddsApp').controller('MarqueBlancheCtrl', function ($scope, $window, $sessionStorage, $timeout) {
    if ($window.location.pathname.indexOf('/secours-populaire/') === 0) {
        $scope.logo = 'logo_secours_populaire.png';
    }

    $scope.$storage = $sessionStorage;

    if (angular.isUndefined($scope.$storage.showIntro)) {
        $timeout(function() {
            $scope.$storage.showIntro = true;
        }, 500);
    }
});

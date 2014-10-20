'use strict';

angular.module('ddsApp').controller('MarqueBlancheCtrl', function($scope, $window, $sessionStorage, $timeout) {
    if ($window.location.pathname.indexOf('/secours-populaire/') === 0) {
        $scope.logo = 'logo_secours_populaire.png';
    }

    $scope.showIntro = false;

    if (false !== $sessionStorage.showIntro) {
        $timeout(function() {
            $scope.showIntro = true;
        }, 500);
    }

    $scope.hideIntro = function() {
        $scope.showIntro = false;
        $sessionStorage.showIntro = false;
    };
});

'use strict';

angular.module('ddsApp').controller('BodyCtrl', function($scope, $window, $localStorage, $timeout) {
    if ($window.location.pathname.indexOf('/secours-populaire/') === 0) {
        $scope.logo = 'logo_secours_populaire.png';
    }

    $scope.showIntro = false;

    if (false !== $localStorage.showIntro) {
        $timeout(function() {
            $scope.showIntro = true;
        }, 500);
    }

    $scope.hideIntro = function() {
        $scope.showIntro = false;
        $localStorage.showIntro = false;
    };
});

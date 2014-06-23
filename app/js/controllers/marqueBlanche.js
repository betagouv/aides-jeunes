'use strict';

angular.module('ddsApp').controller('MarqueBlancheCtrl', function ($scope, $window) {
    if ($window.location.pathname.indexOf('/secours-populaire/') === 0) {
        $scope.logo = 'logo_secours_populaire.png';
    }
});

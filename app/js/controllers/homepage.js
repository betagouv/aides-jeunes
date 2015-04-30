'use strict';

angular.module('ddsApp').controller('HomepageCtrl', function($scope, droitsDescription) {
    $scope.droits = _.filter(droitsDescription, 'isComputed');
});

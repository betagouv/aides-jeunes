'use strict';

angular.module('ddsApp').controller('FoyerCtrl', function ($scope) {
    $scope.children = [{}];
    $scope.removeChild = function(child) { 
      var index = $scope.children.indexOf(child);
      $scope.children.splice(index, 1);
    }
});

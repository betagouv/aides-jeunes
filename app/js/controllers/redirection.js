'use strict';

angular.module('ddsApp').controller('RedirectionCtrl', function($scope, $localStorage, $sessionStorage, $stateParams, SituationService) {
  $sessionStorage.situation = $sessionStorage.situation || { _id: $localStorage.trampoline && $localStorage.trampoline.id };
  delete $localStorage.trampoline;
  $scope.situation = $sessionStorage.situation;

  if (! $scope.situation || ! $scope.situation._id) {
    return;
  }

  SituationService.fetchRepresentation($scope.situation._id, $stateParams.vers)
  .then(function(data) {
    $scope.teleservice = data;
  });
});

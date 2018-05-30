'use strict';

angular.module('ddsApp').controller('RedirectCtrl', function($scope, SituationService) {
  $scope.data = [{
    label: 'votre date de naissance',
    value: '1940-12-12',
    formatter: function(value) { return moment(value).format('LL') },
    key: 'date_naissance_dem'
  }]
});

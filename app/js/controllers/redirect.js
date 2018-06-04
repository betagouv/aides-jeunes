'use strict';

angular.module('ddsApp').controller('RedirectCtrl', function($scope, SituationService, $sce) {
  $scope.endpoint = 'https://reflexe45-test.loiret.fr/public/requestv2/accountless/teleprocedure_id/92/';

  $scope.fields = [{
    label: 'votre date de naissance',
    value: '1940-12-12',
    formatter: function(value) { return moment(value).format('LL'); },
    key: 'date_naissance_dem'
  }];
});

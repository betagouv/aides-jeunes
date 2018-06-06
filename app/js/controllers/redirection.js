'use strict';

angular.module('ddsApp').controller('RedirectionCtrl', function($scope, SituationService, $sce) {
  $scope.endpoint = 'https://reflexe45-test.loiret.fr/public/requestv2/accountless/teleprocedure_id/92/';

  $scope.fields = [{
    label: 'votre date de naissance',
    value: '1940-12-12',
    formatter: function(value) { return moment(value).format('LL'); },
    key: 'date_naissance_dem'
  }, {
    label: 'votre situation familiale',
    value: 0,
    formatter: function(value) { return 'Célibataire'; },
    key: 'situationfam_dem'
  }, {
    label: 'vos salaires (net) sur les 12 derniers mois',
    value: 800*12,
    formatter: function(value) { return value.toString() + ' €'; },
    key: 'salaire_dem'
  }, {
    label: 'votre retraite (net) sur les 12 derniers mois',
    value: 500*12,
    formatter: function(value) { return value.toString() + ' €'; },
    key: 'montantRetraite_dem'
  }, {
    label: 'vos allocations sur les 12 derniers mois',
    value: 200*12,
    formatter: function(value) { return value.toString() + ' €'; },
    key: 'allocations_dem'
  }];
});

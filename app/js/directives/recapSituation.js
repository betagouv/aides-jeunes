'use strict';

angular.module('ddsRecapSituation').directive('recapSituation', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/recap-situation.html',
        scope: {
            situation: '='
        },
        controller: function($scope, $filter) {
            var situation = _.cloneDeep($scope.situation);
            situation.dateDeValeur = moment(new Date(situation.dateDeValeur)).format('YYYY-MM-DD');
            situation.individus.forEach(function(individu) {
                individu.date_naissance = individu.date_naissance.format('YYYY-MM-DD');
                delete individu.hasRessources;
            });
            $scope.situationYAML = jsyaml.dump(_.omit(situation, '__v'));
        }
    };
});

'use strict';

angular.module('ludwig').directive('scenario', function() {
    return {
      scope: {
          test: '=',
      },
      restrict: 'E',
      template: '<div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item"' +
      ' ng-src="{{src}}">' +
      '</iframe></div>',
      controller: function($scope, $sce) {
          $scope.src = $sce.trustAsResourceUrl(window.serverConfig.mesAidesRootUrl + '/recap-situation/' + $scope.test.scenario.situationId);
      }
    };
});

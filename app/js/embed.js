'use strict';

var app = angular.module('ddsRecapSituation', ['ui.router', 'ddsCommon']);

app.config(function($locationProvider, $stateProvider) {
    moment.lang('fr');
    $locationProvider.html5Mode(true);
    $stateProvider.state('home', {
        url: '/:situationId',
        controller: '',
        resolve: {
            situation: function($stateParams, SituationService) {
                return SituationService.restoreRemote($stateParams.situationId);
            }
        },
        views: {
            '': {
                controller: 'EmbedCtrl',
                template: '<div ui-view="recap_situation"></div>',
            },
            'recap_situation@home': {
                controller: 'RecapSituationCtrl',
                templateUrl: '/partials/foyer/recap-situation.html'
            }
        },
    });
}).controller('EmbedCtrl', function($scope, situation) {
    $scope.situation = situation;
});

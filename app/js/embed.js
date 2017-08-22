'use strict';

var app = angular.module('ddsRecapSituation', ['ui.router', 'ddsCommon']);

app.config(function($locationProvider, $stateProvider) {
    moment.lang('fr');
    $locationProvider.html5Mode(true);
    $stateProvider.state('home', {
        url: '/:situationId',
        template: '<recap-situation situation="situation"></recap-situation>',
        controller: 'EmbedCtrl',
        resolve: {
            situation: function($stateParams, SituationService) {
                return SituationService.restoreRemote($stateParams.situationId);
            }
        }
    });
}).controller('EmbedCtrl', function($scope, situation) {
    $scope.situation = situation;
});

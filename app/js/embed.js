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
            situation: function($stateParams, $http) {
                return $http.get('/api/situations/' + $stateParams.situationId).then(function(result) {
                    var situation = result.data;
                    situation.individus.forEach(function(individu) {
                        individu.dateDeNaissance = moment(individu.dateDeNaissance).format('DD/MM/YYYY');
                    });
                    return situation;
                });
            }
        }
    });
}).controller('EmbedCtrl', function($scope, situation) {
    $scope.situation = situation;
});

'use strict';

// Use Webpack's require.context to manage dynamic requires for templates
// The templates will be cached when the application is booted
// https://webpack.js.org/guides/dependency-management/#require-context
var template = require.context('../views', true, /(partials|content-pages)\/.*\.html$/);

var app = angular.module('ddsRecapSituation', ['ui.router', 'ngSanitize', 'ddsCommon']);

app.config(function($locationProvider, $stateProvider) {
    moment.locale('fr');
    $locationProvider.html5Mode(true);
    $stateProvider.state('home', {
        url: '/:situationId',
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
                templateUrl: '/partials/simulation/foyer/recap-situation.html'
            }
        },
    });
}).controller('EmbedCtrl', function($scope, situation) {
    $scope.situation = situation;
});

app.run(function($templateCache) {
    // Preload templates in cache
    // We use the keys() function of the context module API
    // to iterate over the templates, and we store them in Angular's template cache.
    // This means Angular won't try to load the template via AJAX
    _.forEach(template.keys(), function(path) {
        var cacheKey = path.replace('./', '/');
        $templateCache.put(cacheKey, template(path));
    });
});

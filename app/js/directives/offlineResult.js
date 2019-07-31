'use strict';

angular.module('ddsCommon').directive('offlineResult', function($http, $q, ResultatService, SituationService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/offline-result.html',
        scope: {
            situation: '=',
        },
        link(scope, element, attrs) {

            scope.isLoading = ResultatService.isLoading();
            scope.$on('resultat:loading:changed', function(event, loading) {
                scope.isLoading = loading;
            });

            console.log('scope.situation._id', scope.situation._id)

            scope.downloadAsPdf = function() {

                var baseURL = window.location.protocol
                    + '//' + window.location.hostname
                    + (window.location.port ? (':' + window.location.port) : '');

                var documentElement = document.documentElement.cloneNode(true);

                var body = documentElement.querySelector('body');
                var scripts = documentElement.querySelectorAll('body > script');

                // Remove some scripts to avoid CORS errors with PhantomJS
                var scriptsToFilter = _.filter(scripts, function(script) {
                    if (script.innerHTML.match(/piwik/gm)) {
                        return true;
                    }

                    return script.src.match(/piwik/g)
                        || script.src.match(/webpack-dev-server\.js/g)
                        || script.src.match(/livereload\.js/g)
                        || script.src.match(/localhost:/g);
                });

                _.forEach(scriptsToFilter, function(script) {
                    body.removeChild(script);
                });

                // Convert some links to absolute to have a correct rendering
                var images = documentElement.querySelectorAll('img');
                _.forEach(images, function (image) {
                    image.setAttribute('src', baseURL + image.getAttribute('src'));
                });

                var stylesheets = documentElement.querySelectorAll('link[rel="stylesheet"]');
                var promises = _.map(stylesheets, function (stylesheet) {
                    var promise = $http.get(stylesheet.getAttribute('href'));
                    stylesheet.parentNode.removeChild(stylesheet);

                    return promise;
                });

                $q.all(promises)
                    .then(function(values) {
                        // Inline styles
                        _.forEach(values, function(response) {
                            var style = document.createElement('style');
                            style.innerHTML = response.data.replace(/url\(\/fonts/g, 'url(' + baseURL + '/fonts');
                            documentElement.querySelector('head').appendChild(style);
                        });
                    })
                    .then(function() {
                        scope.base64 = window.btoa(unescape(encodeURIComponent(documentElement.outerHTML)));

                        setTimeout(function() {
                            document.getElementById("download").submit();
                        }, 2000);
                    });
            };

            scope.followupSubmitted = false;
            scope.followupSuccess = false;
            scope.followupError = false;

            scope.submitFollowup = function(form) {
                var email = form.email.$modelValue;
                var situation = SituationService.restoreLocal();
                $http.post('api/situations/' + situation._id + '/followup', {
                    email: email,
                }).then(function() {
                    scope.followupSubmitted = true;
                    scope.followupSuccess = true;
                    scope.followupError = false;
                }).catch(function() {
                    scope.followupSubmitted = true;
                    scope.followupSuccess = false;
                    scope.followupError = true;
                });
            };

        },
    };
});

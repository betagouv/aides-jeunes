'use strict';

angular.module('ddsApp').controller('offlineResultOptinCtrl', function($http, $scope, $timeout, $uibModalInstance, SituationService) {

    $scope.followupSubmitted = false;
    $scope.followupSuccess = false;
    $scope.followupError = false;

    $scope.yes = function(form) {
        form.surveyOptin = true;
    };

    $scope.noThanks = function(form) {
        form.surveyOptin = false;
    };

    $scope.submitFollowup = function(form) {

        if (! form.$valid) {
            form.email.$$element[0].focus();
            return;
        }

        var email = form.email.$modelValue;
        if (! email || ! email.length) {
            form.email.$setViewValue('');
            form.email.$render();
            return;
        }

        $scope.submitting = true;
        var situation = SituationService.restoreLocal();
        $http.post('api/situations/' + situation._id + '/followup', {
            email: email,
            surveyOptin: form.surveyOptin
        }).then(function() {
            $scope.followupSubmitted = true;
            $scope.followupSuccess = true;
            $scope.followupError = false;
            $scope.submitting = false;
            $timeout(function() {
                $uibModalInstance.close();
            }, 1000);
        }).catch(function() {
            $scope.followupSubmitted = true;
            $scope.followupSuccess = false;
            $scope.followupError = true;
            $scope.submitting = false;
        });
    };
});

angular.module('ddsCommon').directive('offlineResult', function($http, $q, $uibModal, ResultatService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/offline-result.html',
        scope: {
            situation: '=',
        },
        link(scope) {

            scope.isLoading = ResultatService.isLoading();
            scope.$on('resultat:loading:changed', function(event, loading) {
                scope.isLoading = loading;
            });

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

            scope.openModal = function() {
                $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    size: 'lg',
                    templateUrl: '/partials/offline-result-optin.html',
                    controller: 'offlineResultOptinCtrl',
                });
            };
        },
    };
});

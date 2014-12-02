'use strict';

angular.module('ddsCommon').directive('testAccordion', function() {
    return {
        restrict: 'E',
        templateUrl: '/acceptance-tests/partials/test-accordion.html',
        scope: {
            category: '=',
            idxCategory: '=',
            readOnly: '=',
            acceptanceTests: '='
        },
        controller: function($scope, $http, droitsDescription, $stateParams, $timeout, $location, AcceptanceTestsService, $state, $window, $modal) {
            $scope.droits = _.indexBy(droitsDescription, 'id');

            if ($stateParams.testId && !$scope.readOnly) {
                $timeout(function() {
                    $location.hash('test-' + $stateParams.testId);
                    var testToScroll = _.find($scope.acceptanceTests, {'_id': $stateParams.testId});
                    if (testToScroll) {
                        testToScroll.open = true;
                    }
                });
            }

            $scope.testStatusClass = function(test) {
                var map = {
                    'ok': 'panel-success',
                    'ko': 'panel-danger',
                    'near': 'panel-warning',
                };
                return map[test.status];
            };

            $scope.droitAttenduStatusClass = function(droitAttendu) {
                var map = {
                    'ok': 'success',
                    'ko': 'danger',
                    'unknown': 'info',
                    'near': 'warning',
                };
                return map[droitAttendu.status];
            };

            $scope.displayDroitValue = function(value) {
                if (_.isBoolean(value)) {
                    return value ? 'Oui' : 'Non';
                }

                if (_.isNumber(value)) {
                    return '' + value + ' €';
                }

                return '';
            };

            $scope.newLineToBr = function(text) {
                text = text
                        .replace(/&/g, '&amp;')
                        .replace(/>/g, '&gt;')
                        .replace(/</g, '&lt;');

                return text.replace(/\n/g, '<br>');
            };

            $scope.toggleSituation = function(test) {
                if (!test.situationObject) {
                    $http.get('/api/situations/' + test.situation).then(function(result) {
                        test.situationObject = result.data;
                    });
                }
                test.showSituation = !test.showSituation;
            };

            $scope.launchSingleTest = function(test) {
                AcceptanceTestsService.launchSingleTest(test);
            };

            $scope.launchTestCategory = function(category) {
                AcceptanceTestsService.launchTestCategory(category);
            };

            $scope.validTest = function(idxCategory, category, idxTest, test) {
                $http.put('/api/acceptance-tests/' + test._id + '/validation', {state: 'validated'}).then(function() {
                    if (!$state.is('index.validated') && !$state.is('index.all')) {
                        category.tests.splice(idxTest, 1);
                        if (category.tests.length === 0) {
                            $scope.categories.splice(idxCategory, 1);
                        }
                    }
                    test.state = 'validated';
                });
            };

            $scope.rejectTest = function(idxCategory, category, idxTest, test) {
                var modalInstance = $modal.open({
                    templateUrl: '/acceptance-tests/partials/modal.html',
                    resolve: {
                        comment: function() {
                            return test.comment;
                        }
                    },
                    controller: function($scope, $modalInstance, comment) {
                        $scope.comment = comment;
                        $scope.ok = function (comment) {
                            $modalInstance.close(comment);
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                });

                modalInstance.result.then(function (comment) {
                    $http.put('/api/acceptance-tests/' + test._id + '/validation', {state: 'rejected', comment: comment}).then(function() {
                        if (!$state.is('index.invalidated') && !$state.is('index.all')) {
                            category.tests.splice(idxTest, 1);
                            if (category.tests.length === 0) {
                                $scope.categories.splice(idxCategory, 1);
                            }
                        }
                        test.state = 'rejected';
                    });
                }, function () {
                  // on modal dismissed
                });
            };

            $scope.setWaitingTest = function(idxCategory, category, idxTest, test) {
                $http.put('/api/acceptance-tests/' + test._id + '/validation', {state: 'pending'}).then(function() {
                    if (!$state.is('index.waiting') && !$state.is('index.all')) {
                        category.tests.splice(idxTest, 1);
                        if (category.tests.length === 0) {
                            $scope.categories.splice(idxCategory, 1);
                        }
                    }
                    test.state = 'pending';
                });
            };

            $scope.deleteTest = function(test) {
                if ($window.confirm('Êtes-vous sûr de vouloir supprimer ce test ?')) {
                    $http.delete('/api/acceptance-tests/' + test._id).then(function() {
                        $state.go($state.current, {}, {reload: true});
                    });
                }
            };

            $scope.gotoDebugOpenFisca = function(situation) {
                $http.get('/api/situations/' + situation + '/openfisca-request').then(function(result) {
                    var url = 'http://www.openfisca.fr/outils/trace?api_url=http://localhost:2000&situation=';
                    url += encodeURIComponent(JSON.stringify(result.data));
                    window.location.href = url;
                });
            };
        }
    };
});

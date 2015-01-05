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
        controller: function($scope, $http, droitsDescription, $stateParams, $timeout, $location, $anchorScroll, AcceptanceTestsService, $state, $window, $modal) {
            $scope.droits = _.indexBy(droitsDescription, 'id');

            if ($stateParams.testId && !$scope.readOnly) {
                $location.hash('test-' + $stateParams.testId);
                var testToScroll = _.find($scope.acceptanceTests, {'_id': $stateParams.testId});
                if (testToScroll) {
                    testToScroll.open = true;
                }
                $timeout(function() {
                    $anchorScroll();
                });
            }

            $scope.testStatusClass = function(test) {
                var map = {
                    'ok': 'panel-success',
                    'ko': 'panel-danger',
                    'near': 'panel-warning',
                };
                debugger;
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
                test.showTimeline = false;
            };

            $scope.toggleTimeline = function(test) {
                if (!test.timeline) {
                    $scope.getTimeline(test);
                }
                test.showTimeline = !test.showTimeline;
                test.showSituation = false;
            };

            $scope.getTimeline = function(test) {
                if (test.timeline) {
                    return;
                }
                var user = {lastName: 'Delz', firstName: 'Flo'};
                test.timeline = [{
                    date: new Date('December 7, 2014 12:13:00'),
                    user: user,
                    type: { label: 'Rejet', icon: 'remove'},
                    description: 'Lorem ipsum dolor sit amet, eu deserunt facilisis assentior vis, equidem appetere euripidis mel at. Duo et aliquid inermis, ubique imperdiet ne has, no vidit lorem placerat nec. Per an justo augue conceptam, ex mel facer persius. Mei cu latine senserit accommodare, ne vis augue propriae. Ei usu illud graeco fabellas.'
                }, {
                    date: new Date('December 7, 2014 12:13:00'),
                    user: user,
                    type: { label: 'Validation', icon: 'check'},
                    description: 'Lorem ipsum dolor sit amet, eu deserunt facilisis assentior vis, equidem appetere euripidis mel at. Duo et aliquid inermis, ubique imperdiet ne has, no vidit lorem placerat nec. Per an justo augue conceptam, ex mel facer persius. Mei cu latine senserit accommodare, ne vis augue propriae. Ei usu illud graeco fabellas.'
                }, {
                    date: new Date('December 6, 2014 12:13:00'),
                    type: { label: 'En succès', icon: 'thumbs-up'},
                }, {
                    date: new Date('December 5, 2014 11:13:00'),
                    user: user,
                    type: { label: 'Edition', icon: 'edit'},
                }, {
                    date: new Date('December 4, 2014 11:30:00'),
                    type: { label: 'En erreur', icon: 'thumbs-down'},
                }, {
                    date: new Date('December 3, 2014 11:13:00'),
                    user: user,
                    type: { label: 'Création', icon: 'plus'}
                }];
            };

            $scope.launchSingleTest = function(test) {
                AcceptanceTestsService.launchSingleTest(test);
            };

            $scope.launchTestCategory = function(category) {
                AcceptanceTestsService.launchTestCategory(category);
            };

            $scope.validTest = function(idxCategory, category, idxTest, test) {
                $http.put('/api/acceptance-tests/' + test._id + '/validation', {state: 'validated'}).then(function() {
                    // TODO if selected filter != validated
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
                        // TODO if selected filter != validated
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
                    // TODO if selected filter != validated
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

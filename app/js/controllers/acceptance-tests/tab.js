'use strict';

angular.module('acceptanceTests').controller('TabCtrl', function($scope, $http, $q, $window, $state, $stateParams, $location, $timeout, droitsDescription, acceptanceTests, AcceptanceTestsService) {
    $scope.$emit('stopWaiting');

    $scope.tests = acceptanceTests;
    $scope.categories = AcceptanceTestsService.categorizeTests(acceptanceTests);
    $scope.droits = _.indexBy(droitsDescription, 'id');
    $scope.pendingTests = 0;

    if ($stateParams.testId) {
        $timeout(function() {
            $location.hash('test-' + $stateParams.testId);
            var testToScroll = _.find(acceptanceTests, {'_id': $stateParams.testId});
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

    $scope.launchSingleTest = function(test) {
        $scope.pendingTests++;
        test.running = true;

        return AcceptanceTestsService.launchTest(test)
            .finally(function() {
                $scope.pendingTests--;
            });
    };

    $scope.launchTestCategory = function(category, errorCallback) {
        category.errors = 0;
        category.pendingTests = 0;
        category.tests.forEach(function(test) {
            category.pendingTests++;
            $scope.launchSingleTest(test)
                .catch(function() {
                    category.errors++;
                    if (errorCallback) {
                        errorCallback();
                    }
                }).finally(function() {
                    category.pendingTests--;
                });
        });
    };

    $scope.launchAllTests = function() {
        $scope.errors = 0;
        $scope.categories.forEach(function(category) {
            $scope.launchTestCategory(category, function() {
                $scope.errors++;
            });
        });
    };

    $scope.validTest = function(idxCategory, category, idxTest, test) {
        $http.put('/api/acceptance-tests/' + test._id + '/validation', {state: 'validated'}).then(function() {
            if (!$state.is('index.validated')) {
                category.tests.splice(idxTest, 1);
                if (category.tests.length === 0) {
                    $scope.categories.splice(idxCategory, 1);
                }
            }
            test.state = 'validated';
        });
    };

    $scope.rejectTest = function(idxCategory, category, idxTest, test) {
        $http.put('/api/acceptance-tests/' + test._id + '/validation', {state: 'rejected'}).then(function() {
            if (!$state.is('index.invalidated')) {
                category.tests.splice(idxTest, 1);
                if (category.tests.length === 0) {
                    $scope.categories.splice(idxCategory, 1);
                }
            }
            test.state = 'rejected';
        });
    };

    $scope.setWaitingTest = function(idxCategory, category, idxTest, test) {
        $http.put('/api/acceptance-tests/' + test._id + '/validation', {state: 'pending'}).then(function() {
            if (!$state.is('index.waiting')) {
                category.tests.splice(idxTest, 1);
                if (category.tests.length === 0) {
                    $scope.categories.splice(idxCategory, 1);
                }
            }
            test.state = 'pending';
        });
    };

    $scope.showErrors = function() {
        return angular.isDefined($scope.errors);
    };

    $scope.deleteTest = function(test) {
        if ($window.confirm('Êtes-vous sûr de vouloir supprimer ce test ?')) {
            $http.delete('/api/acceptance-tests/' + test._id).then(function() {
                $state.go($state.current, {}, {reload: true});
            });
        }
    };

    $scope.toggleSituation = function(test) {
        if (!test.situationObject) {
            $http.get('/api/situations/' + test.situation).then(function(result) {
                test.situationObject = result.data;
            });
        }
        test.showSituation = !test.showSituation;
    };
});

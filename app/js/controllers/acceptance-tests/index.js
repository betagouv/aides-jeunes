'use strict';

angular.module('acceptanceTests').controller('IndexCtrl', function($scope, $http, $q, $window, $state, $stateParams, $location, droitsDescription, acceptanceTests) {
    if ($stateParams.testId) {
        $location.hash('test-' + $stateParams.testId);
        _.find(acceptanceTests, {'_id': $stateParams.testId}).open = true;
    }

    $scope.tests = acceptanceTests;
    $scope.droits = {};
    droitsDescription.forEach(function(droit) {
        $scope.droits[droit.id] = droit;
    });
    debugger;
    $scope.pendingTests = 0;

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

    $scope.launchSingle = function(test) {
        delete test.status;
        test.running = true;
        test.droitsAttendus.forEach(function(droit) {
            delete droit.status;
            delete droit.actualValue;
        });

        var deferred = $q.defer();

        var promise = $http.get('/api/situations/' + test.situation + '/simulation');
        promise.then(function(result) {
            var droits = result.data;
            test.status = 'ok';
            test.droitsAttendus.forEach(function(droit) {
                var actualValue = droits[droit.id];
                if (angular.isDefined(actualValue)) {
                    delete droits[droit.id];
                    droit.actualValue = actualValue;
                    if (_.isUndefined(droit.expectedValue)) {
                        droit.status = 'unknown';
                    } else if (droit.actualValue === droit.expectedValue) {
                        droit.status = 'ok';
                    } else if (Math.abs(droit.actualValue - droit.expectedValue) < 0.1) {
                        droit.status = 'near';
                        if (test.status !== 'ko') test.status = 'near';
                    } else {
                        droit.status = 'ko';
                        test.status = 'ko';
                    }
                }
            });
            _.forEach(droits, function(value, id) {
                if (value) {
                    test.droitsAttendus.push({ id: id, expectedValue: undefined, actualValue: value, status: 'unknown' });
                }
            });
            _.where(test.droitsAttendus, { status: undefined }).forEach(function(droit) {
                droit.status = 'ko';
                test.status = 'ko';
                droit.actualValue = false;
            });
            if (test.status === 'ko') {
                deferred.reject();
            } else {
                deferred.resolve();
            }
        }, function() {
            test.status = 'ko';
            test.droitsAttendus.forEach(function(droit) {
                droit.status = 'ko';
            });
            deferred.reject();
        });

        deferred.promise.finally(function() {
            test.running = false;
        });

        return deferred.promise;
    };

    $scope.launchAll = function() {
        $scope.pendingTests = $scope.tests.length;
        $scope.errors = 0;
        $scope.tests.forEach(function(test) {
            $scope.launchSingle(test).then(function() {}, function() {
                $scope.errors++;
            }).finally(function() {
                $scope.pendingTests--;
            });
        });
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

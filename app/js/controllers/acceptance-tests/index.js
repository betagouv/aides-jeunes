'use strict';

angular.module('acceptanceTests').controller('IndexCtrl', function($scope, $http, $timeout) {
    $http.get('/api/acceptance-tests').then(function(result) {
        $scope.tests = result.data;
    });

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

    $scope.launchSingle = function(test) {
        test.droitsAttendus.forEach(function(droit) {
            delete droit.status;
            delete droit.actualValue;
        });

        var promise = $http.get('/api/situations/' + test.situation + '/simulation');
        promise.then(function(result) {
            var droits = result.data;
            test.status = 'ok';
            test.droitsAttendus.forEach(function(droit) {
                var actualValue = droits[droit.name];
                if (angular.isDefined(actualValue)) {
                    delete droits[droit.name];
                    droit.actualValue = actualValue;
                    if (_.isUndefined(droit.expectedValue)) {
                        droit.status = 'unknown';
                    } else if (droit.actualValue === droit.expectedValue) {
                        droit.status = 'ok';
                    } else {
                        droit.status = 'ko';
                        test.status = 'ko';
                    }
                }
            });
            _.forEach(droits, function(value, name) {
                if (value) {
                    test.droitsAttendus.push({ name: name, expectedValue: undefined, actualValue: value, status: 'unknown' });
                }
            });
            _.where(test.droitsAttendus, {status: undefined}).forEach(function(droit) {
                droit.status = 'ko';
                test.status = 'ko';
                droit.actualValue = false;
            });
        }, function() {
            test.status = 'ko';
            test.droitsAttendus.forEach(function(droit) {
                droit.status = 'ko';
            });
        });

        return promise;
    };

    $scope.launchAll = function() {
        $scope.pendingTests = $scope.tests.length;
        $scope.tests.forEach(function(test) {
            $scope.launchSingle(test).finally(function() {
                $scope.pendingTests--;
            });
        });
    };
});

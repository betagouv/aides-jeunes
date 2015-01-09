'use strict';

angular.module('ddsCommon').factory('AcceptanceTestsService', function($q, $http) {
    return {
        getKeywords: function() {
            return $http.get('/api/acceptance-tests/keywords').then(function(result) {
                return result.data;
            });
        },

        get: function(filters) {
            var self = this;
            return $http.get('/api/acceptance-tests', {params: filters}).then(function(result) {
                var tests = result.data;
                self.parseDate(tests);
                _.map(tests, function(test) {
                    if (test.lastExecution) {
                        self.handleResult({data: test.lastExecution}, test);
                    }
                });
                return tests;
            });
        },

        handleResult: function(result, test, deferred) {
            var droits = _.indexBy(result.data.results, 'code');
            test.status = 'ok';
            test.expectedResults.forEach(function(droit) {
                var actualValue = droits[droit.code];
                if (angular.isDefined(actualValue)) {
                    delete droits[droit.code];
                    droit.actualValue = actualValue.value;
                    if (_.isUndefined(droit.value)) {
                        droit.status = 'unknown';
                    } else if (droit.actualValue === droit.value) {
                        droit.status = 'ok';
                    } else if ((Math.abs(droit.actualValue - droit.value) / droit.value) < 0.02) {
                        droit.status = 'ok';
                    } else if ((Math.abs(droit.actualValue - droit.value) / droit.value) < 0.1) {
                        droit.status = 'near';
                        if (test.status !== 'ko') {
                            test.status = 'near';
                        }
                    } else {
                        droit.status = 'ko';
                        test.status = 'ko';
                    }
                }
            });

            _.forEach(droits, function(droit, id) {
                if (droit.value) {
                    test.expectedResults.push({
                        code: id,
                        value: undefined,
                        actualValue: droit.value,
                        status: 'unknown'
                    });
                }
            });

            _.where(test.expectedResults, { status: undefined }).forEach(function(droit) {
                droit.status = 'ko';
                test.status = 'ko';
                droit.actualValue = false;
            });

            if (deferred) {
                if (test.status === 'ko') {
                    deferred.reject();
                } else {
                    deferred.resolve();
                }
            }
        },

        parseDate: function(tests) {
            tests.forEach(function(test) {
                if (test._updated) {
                    var updatedAt = moment(test._updated);
                    test.updatedAt = updatedAt.format('DD/MM/YYYY à HH:mm');
                }
                if (test._created) {
                    var createdAt = moment(test._created);
                    test.createdAt = createdAt.format('DD/MM/YYYY à HH:mm');
                }
            });
        },

        launchTest: function(test) {
            var self = this;
            delete test.status;
            test.expectedResults.forEach(function(expectedResult) {
                delete expectedResult.status;
                delete expectedResult.actualValue;
            });

            var deferred = $q.defer();

            var promise = $http.post('/api/acceptance-tests/' + test._id + '/executions', {});
            promise.then(function(result) {
                return self.handleResult(result, test, deferred);
            }, function() {
                test.status = 'ko';
                test.expectedResults.forEach(function(droit) {
                    droit.status = 'ko';
                });
                deferred.reject();
            });

            deferred.promise.finally(function() {
                test.running = false;
            });

            return deferred.promise;
        },

        launchSingleTest: function(test, beforeLaunch, afterLaunch) {
            var self = this;
            if (beforeLaunch) {
                beforeLaunch();
            }
            test.running = true;

            return self.launchTest(test)
                .finally(function() {
                    if (afterLaunch) {
                        afterLaunch();
                    }
                });
        }
    };
});

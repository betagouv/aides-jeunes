'use strict';

angular.module('ddsCommon').factory('AcceptanceTestsService', function($q, $http) {
    return {
        getKeywords: function() {
            return $http.get('/api/acceptance-tests/keywords').then(function(result) {
                return result.data;
            });
        },

        getOne: function(id) {
            var self = this;
            return $http.get('/api/acceptance-tests/' + id).then(function(result) {
                var tests = [result.data];
                self.parseDate(tests);
                _.map(tests, function(test) {
                    if (test.lastExecution) {
                        self.handleResult({data: test.lastExecution}, test);
                        test.open = true;
                    }
                });
                return tests;
            });
        },

        get: function(filters, isPublic) {
            var self = this;
            return $http.get('/api/acceptance-tests' + (isPublic ? '/public' : ''), {params: filters}).then(function(result) {
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
            var statusMapping = {
                'accepted-exact': 'ok',
                'accepted-2pct': 'ok',
                'accepted-10pct': 'near',
                'rejected': 'ko'
            };

            test.status = statusMapping[result.data.status];
            test.expectedResults = angular.copy(result.data.results);

            test.expectedResults.forEach(function (expectedResult) {
                expectedResult.status = expectedResult.status ? statusMapping[expectedResult.status] : 'unknown';
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
            test.running = true;
            delete test.status;
            test.expectedResults.forEach(function(expectedResult) {
                delete expectedResult.status;
                delete expectedResult.result;
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
        }
    };
});

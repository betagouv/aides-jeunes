'use strict';

angular.module('acceptanceTests').factory('AcceptanceTestsService', function($q, $http) {
    return {
        categorizeTests: function(tests) {
            var categories = [];
            var categoriesMap = {};
            var unknownCategory = { name: 'Non catégorisés', tests: [] };
            tests.forEach(function(test) {
                if (test._updated) {
                    var updatedAt = moment(test._updated);
                    test.updatedAt = updatedAt.format('DD/MM/YYYY') + ' à ' + updatedAt.format('HH:mm');
                }
                if (test._created) {
                    var createdAt = moment(test._created);
                    test.createdAt = createdAt.format('DD/MM/YYYY') + ' à ' + createdAt.format('HH:mm');
                }
                var index = test.name.indexOf(']');
                if (-1 !== index) {
                    var categoryName = test.name.substring(1, index);
                    test.name = test.name.substring(index + 2, test.name.length);
                    var category = categoriesMap[categoryName];
                    if (!category) {
                        category = categoriesMap[categoryName] = {name: categoryName, tests: []};
                        categories.push(category);
                    }
                    category.tests.push(test);
                } else {
                    unknownCategory.tests.push(test);
                }
            });

            if (unknownCategory.tests.length) {
                categories.push(unknownCategory);
            }

            categories.forEach(function(category) {
                category.tests = _.sortBy(category.tests, 'name');
            });

            return categories;
        },

        launchTest: function(test) {
            var deferred = $q.defer();

            var promise = $http.post('/api/acceptance-tests/' + test._id + '/executions', {});
            promise.then(function(result) {
                var droits = result.data.droitsCalcules;
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
                        } else if ((Math.abs(droit.actualValue - droit.expectedValue) / droit.expectedValue) < 0.02) {
                            droit.status = 'ok';
                        } else if ((Math.abs(droit.actualValue - droit.expectedValue) / droit.expectedValue) < 0.1) {
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
        }
    };
});

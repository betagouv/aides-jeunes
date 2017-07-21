'use strict';

angular.module('ddsApp').controller('ValidationCtrl', function($scope, $http, MappingService, MigrationService, SituationService) {
    function deepDiffRight(left, right) {
      // if they are equals, return undefined
      if (angular.equals(left, right)) return;
      // form now on, we can assure that `left` and `right` are not equals (equivalents)

      // if `left` and `right` are primitives, value changed
      // if `left` is a primitive and `right` an object, value has been replaced with an object
      // if `left` is an object and `right` a primitive, value has been replaced with a primitive
      // use `_.copy` to prevent object referrence issues
      if (! angular.isObject(left) || ! angular.isObject(right)) return angular.copy(right);

      // make `result` the same type as `right`
      var result = angular.isArray(right) ? [] : {};

      // since we know that both are objects,
      // iterate on `right` to see what changed or what's new in `right`
      angular.forEach(right, function (value, key) {
        // recursion
        var diff = deepDiffRight(left[key], right[key]);
        // since the function returns undefined when `left` and `right` are equals,
        // only assing non-undefined values to result
        if (! angular.isUndefined(diff)) result[key] = diff;
      });

      return result;
    }

    $scope.validation = {
        results: 1,
        failedTests: [],
        passedTests: [],
    };

    $scope.validation.index = 0;
    $scope.validation.step = 1;

    function nextAction(end) {
        if ($scope.validation.passedTests.length + $scope.validation.failedTests.length == end) {
            $scope.validation.index = $scope.validation.index + 1;
            if ($scope.validation.index < $scope.validation.tests.length)
            {
                runTestComparaison();
            }
        }
    }

    function areEqual(test, sourceSituation, testName, local, remote) {
        var diff = [
            deepDiffRight(local, remote),
            deepDiffRight(remote, local),
        ];

        if (diff[0]) {
            var requests = {
                id: test._id,
                type: testName,
                situation: JSON.stringify(sourceSituation, null, 2),
                diff: [
                    JSON.stringify(diff[0], null, 2),
                    JSON.stringify(diff[1], null, 2),
                ],
                local: JSON.stringify(local, null, 2),
                remote: JSON.stringify(remote, null, 2),
            };
            $scope.validation.failedTests.push(_.assign({}, test, requests));
            return false;
        } else {
            $scope.validation.passedTests.push(test);
            return true;
        }
    }

    function runTestComparaison() {
        var start = $scope.validation.index * $scope.validation.step;
        var end = ($scope.validation.index + 1) * $scope.validation.step;
        $scope.validation.tests.slice(start, end).forEach(function(test) {
            if (! $scope.validation.failedTests.length) {
                $http.get('api/situations/' + test.scenario.situationId + '/openfisca-request')
                .then(function(openfiscaRequest) {
                    return $http.get('api/situations/' + test.scenario.situationId)
                    .then(function(situationResponse) {
                        var sourceSituation = situationResponse.data;

                        MigrationService.persistedSituationPretransformationUpdate(sourceSituation);
                        var situation = MigrationService.migratePersistedSituation(sourceSituation);

                        $http.post('api/simulations', MappingService.buildOpenFiscaRequest(situation))
                        .then(function(simulationResponse) {
                            return simulationResponse.data;
                        })
                        .then(function(simulation) {
/*
                            var clonedSituation = _.cloneDeep(situation);
                            if (! areEqual(test,
                                sourceSituation,
                                'UI situation',
                                MappingService.buildSituationFromDB(simulation),
                                clonedSituation)) {
                                return;
                            }//*/
                            $http.get('api/simulations/' + simulation._id + '/request')
                            .then(function(requestResult) {
                                var newOpenfiscaRequest = requestResult.data;
                                var legacyOpenfiscaRequest = openfiscaRequest.data;

                                legacyOpenfiscaRequest.variables.sort();
                                MigrationService.precomparisonUpdate(sourceSituation._id, newOpenfiscaRequest, legacyOpenfiscaRequest);

                                if (areEqual(test,
                                    sourceSituation,
                                    'OpenFisca request',
                                    newOpenfiscaRequest,
                                    legacyOpenfiscaRequest)) {
                                    nextAction(end);
                                }

                            });
                        });
                    });
                }, function(error) {
                    var result = _.assign({
                        json: JSON.stringify(test, null, 2),
                        error: error,
                    });
                    $scope.validation.failedTests.push(_.assign(result, test));
                });
            }
        });
    }

    $http.get('api/public/acceptance-tests')
    .then(function(tests) {
        $scope.validation.tests = tests.data;
        return tests.data;
    }, function(error) {
        $scope.validation.error = error;
    })
    .then(function(tests) {
        $scope.validation.passedTests = $scope.validation.tests.slice(0, $scope.validation.index);
        runTestComparaison();
    });
});

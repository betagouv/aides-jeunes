'use strict';

angular.module('ddsApp').controller('ValidationCtrl', function($scope, $http, MappingService) {
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

    function preprocessOpenfiscaRequests(newRequest, legacyRequest) {
        var props = ['coloc', 'logement_chambre'];
        var newMenage = newRequest.scenarios[0].test_case.menages[0];
        var legacyMenage = legacyRequest.scenarios[0].test_case.menages[0];
        props.forEach(function(prop) {
            if (! newMenage[prop]) {
                if (_.every(legacyMenage[prop], function(value, key) { return ! value; })) {
                    delete legacyMenage[prop];
                }
            }
        });
    }

    function runTestComparaison() {
        var start = $scope.validation.index * $scope.validation.step,
            end = ($scope.validation.index + 1) * $scope.validation.step;
        $scope.validation.tests.slice(start, end).forEach(function(test) {
            if (! $scope.validation.failedTests.length) {
                $http.get('api/situations/' + test.scenario.situationId + '/openfisca-request')
                .then(function(openfiscaRequest) {
                    return $http.get('api/situations/' + test.scenario.situationId)
                    .then(function(situationResponse) {
                        var sourceSituation = situationResponse.data;

                        var situation = MappingService.migratePersistedSituation(sourceSituation);

                        $http.post('api/simulations', MappingService.buildOpenFiscaRequest(situation))
                        .then(function(simulationResponse) {
                            return simulationResponse.data._id;
                        })
                        .then(function(simulationId) {
                            $http.get('api/simulations/' + simulationId + '/request')
                            .then(function(requestResult) {
                                var newOpenfiscaRequest = requestResult.data;

                                openfiscaRequest.data.variables.sort();
                                preprocessOpenfiscaRequests(newOpenfiscaRequest, openfiscaRequest.data);
                                var diff = deepDiffRight(newOpenfiscaRequest, openfiscaRequest.data);

                                if (diff) {
                                    var requests = {
                                        id: test._id,
                                        situation: JSON.stringify(sourceSituation, null, 2),
                                        diff: JSON.stringify(diff, null, 2),
                                        local: JSON.stringify(newOpenfiscaRequest, null, 2),
                                        remote: JSON.stringify(openfiscaRequest.data, null, 2),
                                    };
                                    $scope.validation.failedTests.push(_.assign({}, test, requests));
                                } else {
                                    $scope.validation.passedTests.push(test);/*
                                    $http.post('/api/simulations', newOpenfiscaRequest)
                                    .then(function(persistedSimulation) {
                                        var simulationDiff = deepDiffRight(newOpenfiscaRequest, _.omit(persistedSimulation.data, '__v', '_id'));
                                        if (simulationDiff) {
                                            $scope.validation.failedTests.push(_.assign({
                                                diff: JSON.stringify(simulationDiff, null, 2),
                                                local: JSON.stringify(newOpenfiscaRequest, null, 2),
                                                remote: JSON.stringify(persistedSimulation.data, null, 2),
                                            }, test, simulationDiff));
                                        } else {
                                            //nextAction(end);
                                        }
                                    }, function(error) {
                                        $scope.validation.failedTests.push(_.assign({}, test, requests));
                                        //nextAction(end);
                                    });//*/
                                }
                                nextAction(end);

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

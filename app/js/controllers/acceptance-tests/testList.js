'use strict';

angular.module('acceptanceTests').controller('TestListCtrl', function($scope, $modal, $window, $state, $stateParams, $location, $timeout,
    $http, $anchorScroll, droitsDescription, AcceptanceTestsService) {
    $scope.$emit('stopWaiting');
    $scope.droits = _.indexBy(droitsDescription, 'id');

    if ($stateParams.testId && !$scope.readOnly) {
        $location.hash('test-' + $stateParams.testId);
        var testToScroll = _.find($scope.tests, {'_id': $stateParams.testId});
        if (testToScroll) {
            testToScroll.open = true;
        }
        $timeout(function() {
            $anchorScroll();
        });
    }

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
        $http.get('/api/acceptance-tests/' + test._id + '/timeline').then(function(result) {
            if (result.data.length === 0) {
                result.data.push({type: 'no-activity'});
            }
            test.timeline = result.data;
        });
    };

    $scope.gotoDebugOpenFisca = function(situation) {
        $http.get('/api/situations/' + situation + '/openfisca-request').then(function(result) {
            var url = 'http://www.openfisca.fr/outils/trace?api_url=http://localhost:2000&situation=';
            url += encodeURIComponent(JSON.stringify(result.data));
            window.location.href = url;
        });
    };

    $scope.launchSingleTest = function(test) {
        AcceptanceTestsService.launchSingleTest(test);
    };

    $scope.validTest = function(test) {
        $http.put('/api/acceptance-tests/' + test._id + '/validation', {state: 'validated'}).then(function() {
            test.state = 'validated';
            $scope.getTimeline(test);
        });
    };

    $scope.rejectTest = function(test) {
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
            $http.put('/api/acceptance-tests/' + test._id + '/validation', {state: 'rejected', rejectionMessage: comment}).then(function() {
                test.state = 'rejected';
                $scope.getTimeline(test);
            });
        }, function () {
          // on modal dismissed
        });
    };

    $scope.setWaitingTest = function(test) {
        $http.put('/api/acceptance-tests/' + test._id + '/validation', {state: 'pending'}).then(function() {
            test.state = 'pending';
            $scope.getTimeline(test);
        });
    };

    $scope.deleteTest = function(test) {
        if ($window.confirm('Êtes-vous sûr de vouloir supprimer ce test ?')) {
            $http.delete('/api/acceptance-tests/' + test._id).then(function() {
                $state.go($state.current, {}, {reload: true});
            });
        }
    };
});

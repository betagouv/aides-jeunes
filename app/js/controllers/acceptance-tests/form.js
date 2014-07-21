'use strict';

angular.module('acceptanceTests').controller('FormCtrl', function($scope, $http, $state, situation, droits) {
    $scope.test = { situation: situation._id, droitsAttendus: [] };
    $http.get('/resources/droits.json').then(function(result) {
        $scope.droitsChoices = result.data;
        _.forEach(droits, function(value, name) {
            if (_.isBoolean(value) || (_.isNumber(value) && 0 !== value)) {
                $scope.test.droitsAttendus.push({ ref: _.find($scope.droitsChoices, {id: name}), expectedValue: value });
            }
        });
    });

    $scope.removeDroit = function(droit) {
        var index = $scope.test.droitsAttendus.indexOf(droit);
        $scope.test.droitsAttendus.splice(index, 1);
    };

    $scope.submit = function() {
        $scope.test.droitsAttendus.forEach(function(droit) {
            droit.name = droit.ref.id;
            delete droit.ref;
        });
        $http.post('/api/acceptance-tests', $scope.test).then(function() {
            $state.go('index');
        });
    };
});

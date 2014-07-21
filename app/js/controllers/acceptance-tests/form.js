'use strict';

angular.module('acceptanceTests').controller('FormCtrl', function($scope, $http, $state, situation, droits, test) {
    var editMode = !!test;
    if (editMode) {
        $scope.pageTitle = 'Modification du cas de test "' + test.name + '"';
        $scope.submitLabel = 'Modifier ce cas de test';
    } else {
        $scope.pageTitle = 'Nouveau cas de test';
        $scope.submitLabel = 'Créer ce cas de test';
    }

    $http.get('/resources/droits.json').then(function(result) {
        $scope.droitsChoices = result.data;
        if (editMode) {
            $scope.test = test;
            $scope.test.droitsAttendus.forEach(function(droit) {
                droit.ref = _.find($scope.droitsChoices, { id: droit.id });
            });
        } else {
            $scope.test = { situation: situation._id, droitsAttendus: [] };
            _.forEach(droits, function(value, name) {
                if (_.isBoolean(value) || (_.isNumber(value) && 0 !== value)) {
                    $scope.test.droitsAttendus.push({ ref: _.find($scope.droitsChoices, {id: name}), expectedValue: value });
                }
            });
        }
    });

    $scope.removeDroit = function(droit) {
        var index = $scope.test.droitsAttendus.indexOf(droit);
        $scope.test.droitsAttendus.splice(index, 1);
    };

    $scope.submit = function() {
        $scope.test.droitsAttendus.forEach(function(droit) {
            droit.id = droit.ref.id;
            delete droit.ref;
        });
        if (editMode) {
            $http.put('/api/acceptance-tests/' + $scope.test._id, $scope.test).then(function() {
                $state.go('index');
            });
        } else {
            $http.post('/api/acceptance-tests', $scope.test).then(function() {
                $state.go('index');
            });
        }
    };
});

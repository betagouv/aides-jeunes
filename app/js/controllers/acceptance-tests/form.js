'use strict';

angular.module('acceptanceTests').controller('FormCtrl', function($scope, $http, $state, $stateParams, droitsDescription, droitsObtenus, test) {
    var editMode = !!test;
    if (editMode) {
        $scope.pageTitle = 'Modification du cas de test "' + test.name + '"';
        $scope.submitLabel = 'Modifier ce cas de test';
    } else {
        $scope.pageTitle = 'Nouveau cas de test';
        $scope.submitLabel = 'Créer ce cas de test';
    }

    $scope.droitsChoices = droitsDescription;
    if (editMode) {
        $scope.test = test;
        $scope.test.droitsAttendus.forEach(function(droit) {
            droit.ref = _.find($scope.droitsChoices, { id: droit.id });
        });
    } else {
        $scope.test = { situation: $stateParams.situationId, droitsAttendus: [] };
        _.forEach(droitsObtenus, function(value, name) {
            if (_.isBoolean(value) || (_.isNumber(value) && 0 !== value)) {
                $scope.test.droitsAttendus.push({ ref: _.find($scope.droitsChoices, {id: name}), expectedValue: value });
            }
        });
    }

    $scope.removeDroit = function(droit) {
        var index = $scope.test.droitsAttendus.indexOf(droit);
        $scope.test.droitsAttendus.splice(index, 1);
    };

    $scope.submit = function() {
        $scope.submitting = true;
        $scope.test.droitsAttendus.forEach(function(droit) {
            droit.id = droit.ref.id;
        });
        var test = _.pick($scope.test, ['_id', 'situation', 'name', 'description', 'droitsAttendus']);
        if (editMode) {
            $http.put('/api/acceptance-tests/' + test._id, test).then(function() {
                $state.go('index.all', {'testId': test._id});
            });
        } else {
            $http.post('/api/acceptance-tests', test).then(function(result) {
                $state.go('index.all', {'testId': result.data._id});
            });
        }
    };
});

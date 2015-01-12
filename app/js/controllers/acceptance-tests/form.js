'use strict';

angular.module('acceptanceTests').controller('FormCtrl', function($scope, $http, $state, $stateParams, droitsDescription, droitsObtenus, test, keywords) {
    $scope.keywords = keywords;

    if (!test.keywords) {
        test.keywords = [];
    }

    $scope.selectedKeywords = test.keywords;

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
        $scope.test.expectedResults.forEach(function(droit) {
            droit.ref = _.find($scope.droitsChoices, { id: droit.code });
            droit.result = droitsObtenus[droit.code];
        });
    } else {
        $scope.test = { situation: $stateParams.situationId, expectedResults: [] };
        _.forEach(droitsObtenus, function(value, name) {
            if ((_.isBoolean(value) && true === value) || (_.isNumber(value) && 0 !== value)) {
                $scope.test.expectedResults.push({
                    ref: _.find($scope.droitsChoices, { id: name }),
                    result: value,
                    exptectedValue: value
                });
            }
        });
    }

    $scope.droitSelected = function(droit) {
        droit.result = droitsObtenus[droit.ref.id];
        droit.expectedValue = droit.result;
    };

    $scope.formatDroitValue = function(value) {
        if (_.isNumber(value)) {
            return '' + value + ' €';
        }
        return value ? 'Oui' : 'Non';
    };

    $scope.removeDroit = function(droit) {
        var index = $scope.test.expectedResults.indexOf(droit);
        $scope.test.expectedResults.splice(index, 1);
    };

    $scope.submit = function() {
        $scope.submitting = true;
        $scope.test.expectedResults.forEach(function(droit) {
            droit.code = droit.ref.id;
        });
        var test = _.pick($scope.test, ['_id', 'situation', 'name', 'description', 'expectedResults', 'keywords']);
        if (editMode) {
            $http.put('/api/acceptance-tests/' + test._id, test).then(function() {
                $state.go('index.list', {'testId': test._id});
            });
        } else {
            $http.post('/api/acceptance-tests', test).then(function(result) {
                $state.go('index.list', {'testId': result.data._id});
            });
        }
    };
});

'use strict';

angular.module('ddsApp').controller('SuggestionCtrl', function($scope, $http,droitsDescription, SituationService, ResultatService) {
    $scope.test = {
        name: 'Nom du test',
        description: 'Description du test',
        expectedResults: []
    };
    $scope.situationYAML = SituationService.YAMLRepresentation($scope.situation);

    $scope.submitting = false;
    $scope.submitLabel = function() {
        return $scope.submitting ? 'Enregistrement…' : 'Enregistrer';
    };

    var droits = [];
    for (var level in droitsDescription) {
        for (var provider in droitsDescription[level]) {
            for (var prestation in droitsDescription[level][provider].prestations) {
                droits.push(_.assign({
                    code: prestation,
                    level: level,
                    provider: provider,
                }, droitsDescription[level][provider].prestations[prestation]));
            }
        }
    }
    var droitsById = _.keyBy(droits, 'code');
    $scope.possibleValues = _.sortBy(droits, 'label');

    function displayValueFor(droit, value) {
        if (_.isBoolean(value)) {
            return value ? 'Oui' : 'Non';
        }

        if (_.isNumber(value)) {
            return value + ' ' + ( droit.unit || '€' );
        }

        if (_.isString(value)) {
            return droit.uncomputability && droit.uncomputability[value] && droit.uncomputability[value].reason.admin || 'raison non définie';
        }

        return value;
    }
    $scope.displayValueFor = displayValueFor;

    function generateState(test) {
        var outputVariables = test.expectedResults.reduce(function(results, expectedValue) {
            results[expectedValue.ref.code] = expectedValue.expectedValue;
            return results;
        }, {});

        return {
            name: test.name,
            description: test.description,
            output_variables: outputVariables
        };
    }

    function getActualValue(droitId) {
        if (! $scope.droits) {
            return;
        }
        var droit = droitsById[droitId];
        var providerData = $scope.droits[droit.level];
        if (droit.level == 'prestationsNationales')
            return providerData[droitId];

        return providerData[droit.provider] && providerData[droit.provider].prestations[droitId];
    }

    $scope.droitSelected = function(expectedResult) {
        if (! expectedResult)
            return;
        var actualValue = getActualValue(expectedResult.ref.code) || {};
        expectedResult.result = actualValue.montant;
        expectedResult.expectedValue = expectedResult.result;
        delete expectedResult.shouldCompute;
    };

    function createSuggestionFile() {
        if ($scope.submitting) {
            return;
        }

        $scope.submitting = true;
        var testMetadata = generateState($scope.test);
        $http.post('api/situations/' + $scope.situation._id + '/openfisca-test', testMetadata)
        .then(function(result) {
            var repository = 'openfisca-france';
            return $http.post('https://ludwig.incubateur.net/api/repositories/github/ludwig-test/' + repository + '/suggest', {
                title: testMetadata.name,
                body: testMetadata.description,
                content: result.data
            });
        })
        .then(function(result) {
            console.log(result.data);
        })
        .catch(function(error) {
            $scope.error = error.message;
        })
        .finally(function() {
            $scope.submitting = false;
        });
    }
    $scope.createSuggestionFile = createSuggestionFile;
});

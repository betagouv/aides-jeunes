'use strict';

angular.module('ddsApp').factory('SuggestionService', function() {
    return {
        determineExtensionAndRepository: function(aids) {
            var extensions = _.chain(aids)
                .filter(function(aid) { return aid.provider.level == 'partenairesLocaux'; })
                .map(function(aid) { return aid.provider.repository || aid.provider.id; })
                .uniq()
                .value();

            if (! extensions.length) {
                return {
                    repository: 'openfisca-france'
                };
            }

            if (extensions.length > 1) {
                var message = 'Vous avez spécifié des prestations de plusieurs extensions. Dans un test donné, vous ne pouvez spécifier que des prestations nationales et celle d‘une seule extension. Pour plus d‘information, contactez-nous.';
                return {
                    error: message
                };
            }

            var dest = 'openfisca-' + extensions[0];
            return {
                extension: dest,
                repository: dest,
            };
        },
        generateTestMetadata: function(test, extension) {
            var outputVariables = test.expectedResults.reduce(function(results, expectedValue) {
                results[expectedValue.ref.id] = expectedValue.expectedValue;
                return results;
            }, {});

            return {
                extension: extension,
                name: test.name,
                description: test.description,
                output: outputVariables
            };
        }
    };
});

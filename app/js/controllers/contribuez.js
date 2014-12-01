'use strict';

angular.module('ddsApp').controller('ContribuezCtrl', function($scope, droitsDescription, acceptanceTests, AcceptanceTestsService) {
    $scope.$emit('stopWaiting');

    $scope.tests = acceptanceTests;
    $scope.categories = AcceptanceTestsService.categorizeTests(acceptanceTests);
    $scope.droits = _.indexBy(droitsDescription, 'id');

    $scope.testStatusClass = function(test) {
        var map = {
            'ok': 'panel-success',
            'ko': 'panel-danger',
            'near': 'panel-warning',
        };
        return map[test.status];
    };

    $scope.droitAttenduStatusClass = function(droitAttendu) {
        var map = {
            'ok': 'success',
            'ko': 'danger',
            'unknown': 'info',
            'near': 'warning',
        };
        return map[droitAttendu.status];
    };

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
});

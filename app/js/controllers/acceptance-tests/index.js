'use strict';

angular.module('acceptanceTests').controller('IndexCtrl', function($scope) {
    $scope.tests = [
        {
            name: 'chomeur 1 enfant',
            droitsAttendus: [
                {
                    name: 'cmu-c',
                    value: true
                },
                {
                    name: 'rsa',
                    value: 466
                }
            ]
        },
        {
            name: 'étudiant enceinte',
            droitsAttendus: [
                {
                    name: 'allocs',
                    value: 344
                },
                {
                    name: 'rsa',
                    value: 466
                },
                {
                    name: 'aspa',
                    value: 12
                }
            ]
        }
    ];

    $scope.displayDroitValue = function(value) {
        if (typeof value === 'boolean') {
            return 'Oui';
        }
        return '' + value + ' €';
    };
});

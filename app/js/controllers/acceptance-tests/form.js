'use strict';

angular.module('acceptanceTests').controller('FormCtrl', function($scope, $http, $state, situation, droits) {
    $scope.droitsChoices = [
        {
            id: 'aspa',
            label: 'Allocation de Solidarité aux Personnes Âgées',
            shortLabel: 'ASPA',
            imgSrc: 'logo_caf.png'
        },
        {
            id: 'acs',
            label: 'Aide pour une Complémentaire Santé',
            shortLabel: 'ACS',
            imgSrc: 'logo_caf.png'
        },
        {
            id: 'cmu_c',
            hasMontant: false,
            label: 'Couverture Maladie Universelle Complémentaire',
            shortLabel: 'CMU-C',
            imgSrc: 'logo_cmu.png'
        },
        {
            id: 'apl',
            label: 'Aide Personnalisée au Logement',
            shortLabel: 'APL',
            imgSrc: 'logo_caf.png'
        },
        {
            id: 'als',
            label: 'Allocation de Logement Social',
            shortLabel: 'ALS',
            imgSrc: 'logo_caf.png'
        },
        {
            id: 'alf',
            label: 'Allocation de Logement Familial',
            shortLabel: 'ALF',
            imgSrc: 'logo_caf.png'
        },
        {
            id: 'af',
            label: 'Allocations Familiales',
            shortLabel: 'AF',
            imgSrc: 'logo_caf.png'
        },
        {
            id: 'rsa',
            label: 'Revenu de Solidarité Active',
            shortLabel: 'RSA',
            imgSrc: 'logo_caf.png'
        }
    ];

    $scope.test = {situation: situation._id, droits: []};
    _.forEach(droits, function(value, name) {
        if (_.isBoolean(value) || (_.isNumber(value) && 0 !== value)) {
            $scope.test.droits.push({ref: _.find($scope.droitsChoices, {id: name}), expectedValue: value});
        }
    });

    $scope.removeDroit = function(droit) {
        var index = $scope.test.droits.indexOf(droit);
        $scope.test.droits.splice(index, 1);
    };

    $scope.submit = function() {
        $scope.test.droits.forEach(function(droit) {
            droit.name = droit.ref.id;
            delete droit.ref;
        });
        $http.post('/api/acceptance-tests', $scope.test).then(function() {
            $state.go('index');
        });
    };
});

'use strict';

angular.module('ddsApp').controller('FoyerPersonnesAChargeCtrl', function($scope, $location, $anchorScroll, $timeout) {
    $scope.sections = [
        {
            role: 'enfant',
            label: 'Vos enfants',
            formLabel: 'Nouvel enfant',
            labelNewPersonne: 'Ajouter un enfant<br>',
            style: 'margin-top: 33px;',
            individuFormView: 'enfantForm'
        },
        {
            role: 'personneACharge',
            label: 'Personnes à charge',
            formLabel: 'Nouvelle personne à charge',
            labelNewPersonne: 'Ajouter une personne à charge',
            style: 'margin-top: 33px;',
            individuFormView: 'personneAChargeForm'
        }/*,
        {
            role: 'personneSousMemeToit',
            label: 'Autres personnes vivant sous votre toit',
            formLabel: 'Nouvelle personne vivant sous votre toit',
            labelNewPersonne: 'Ajouter une personne vivant sous mon toit',
            individuFormView: 'personneSousMemeToitForm'
        }*/
    ];

    $scope.sections.forEach(function(section) {
        section.personnes = _.where($scope.situation.individus, { role: section.role });
    });

    var handleNewPersonne = function(personne) {
        $scope.formNewPersonneSection.personnes.push(personne);
        $scope.formNewPersonneSection = null;
    };

    $scope.$on('individu.enfant', function(e, personne) {
        handleNewPersonne(personne);
    });

    $scope.$on('individu.personneACharge', function(e, personne) {
        handleNewPersonne(personne);
    });

    $scope.$on('individu.personneSousMemeToit', function(e, personne) {
        handleNewPersonne(personne);
    });

    $scope.newPersonne = function(section) {
        $scope.formNewPersonneSection = section;
        $timeout(function() {
            $location.hash('form-scroll');
            $anchorScroll();
        });
    };

    $scope.removePersonne = function(section, personne) {
        var index = section.personnes.indexOf(personne);
        section.personnes.splice(index, 1);
    };

    $scope.validate = function() {
        $scope.$emit('personnesACharge', _.flatten($scope.sections, 'personnes'));
    };
});

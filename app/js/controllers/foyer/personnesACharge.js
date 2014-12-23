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
            label: 'Vos personnes à charge',
            formLabel: 'Nouvelle personne à charge',
            labelNewPersonne: 'Ajouter une personne à charge',
            style: 'margin-top: 33px;',
            individuFormView: 'personneAChargeForm'
        },
        {
            role: 'personneSousMemeToit',
            label: 'Autres personnes vivant sous votre toit',
            formLabel: 'Nouvelle personne vivant sous votre toit',
            labelNewPersonne: 'Ajouter une personne vivant sous mon toit',
            individuFormView: 'personneSousMemeToitForm'
        }
    ];

    $scope.sections.forEach(function(section) {
        section.personnes = _.where($scope.situation.individus, { role: section.role });
    });

    $scope.$on('individu.personne', function(e, personne) {
        personne.role = $scope.formNewPersonneSection.role;
        $scope.formNewPersonneSection.personnes.push(personne);
        $scope.formNewPersonneSection = null;
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

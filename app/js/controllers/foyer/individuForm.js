'use strict';

angular.module('ddsApp').controller('FoyerIndividuFormCtrl', function($scope, options, situationsFamiliales, SituationService, IndividuService) {
    $scope.statutsSpecifiques = IndividuService.getStatutsSpecifiques();

    options.minAge = 0;
    options.maxAge = 130;
    if ('enfant' === options.individuRole) {
        options.displayCancelButton = true;
        options.captureGardeAlternee = true;

        $scope.statutsSpecifiques = _.filter($scope.statutsSpecifiques, function(statut) {
          return statut.id !== 'retraite';
        });
    }
    $scope.options = options;

    $scope.selectedStatuts = {};
    $scope.situationsMaritales = _.filter(situationsFamiliales, 'isSituationCouple');
    $scope.scolariteOptions = [
        {
            id: 'inconnue',
            label: 'Aucun des deux'
        },
        {
            id: 'college',
            label: 'Au collège'
        },
        {
            id: 'lycee',
            label: 'Au lycée / En CAP / En CPA'
        }
    ];

    $scope.individu = {
        nationalite: 'fr',
        assPreconditionRemplie: false,
        scolarite: 'college',
        tauxInvalidite: 'moins50',
        boursier: false,
        aCharge: true,
        place: false,
        role: options.individuRole
    };

    if (true === ($scope.captureRelationConjoint = !!options.captureRelationConjoint)) {
        $scope.individu.statutMarital = 'mariage';
    }

    var isIndividuParent = IndividuService.isRoleParent(options.individuRole);

    if (isIndividuParent) {
        var individu = _.find($scope.situation.individus, { role: options.individuRole });
        if (individu) {
            $scope.individu = _.merge($scope.individu, individu);
            $scope.individu.situationsPro.forEach(function(situationPro) {
                $scope.selectedStatuts[situationPro.situation] = true;
            });
        }
    }

    $scope.submit = function(form) {
        $scope.submitted = true;
        if (form.$valid) {
            $scope.individu.situationsPro = [];

            _.forEach($scope.selectedStatuts, function(selected, statut) {
                if (selected) {
                    $scope.individu.situationsPro.push({ situation: statut });
                }
            });

            if (!$scope.captureEligibiliteAss()) {
                delete $scope.individu.assPreconditionRemplie;
            }

            if (!$scope.captureTauxInvalidite()) {
                delete $scope.individu.tauxInvalidite;
            }

            if (!$scope.captureEtudiantBoursier()) {
                delete $scope.individu.boursier;
            }

            if (!$scope.captureScolarite(form)) {
                delete $scope.individu.scolarite;
            }

            $scope.$emit('individu.' + options.individuRole, $scope.individu);
        }
    };

    $scope.captureEligibiliteAss = function() {
        /* jshint -W069 */
        return isIndividuParent && $scope.selectedStatuts['demandeur_emploi'];
    };

    $scope.captureTauxInvalidite = function() {
        return isIndividuParent && $scope.selectedStatuts.handicap;
    };

    $scope.captureEnfantPlace = function() {
        return !isIndividuParent && $scope.selectedStatuts.handicap;
    };


    $scope.captureEtudiantBoursier = function() {
        return $scope.selectedStatuts.etudiant;
    };

    $scope.catpurePersonneACharge = function(form) {
        if (!isIndividuParent && form.dateDeNaissance.$valid) {
            return IndividuService.age($scope.individu) >= 1;
        }
    };

    $scope.captureScolarite = function(form) {
        if (!isIndividuParent && form.dateDeNaissance.$valid) {
            var age = IndividuService.age($scope.individu);
            return age <= 25 && age > 8;
        }

        return false;
    };

    $scope.cancel = function() {
        $scope.$emit('actionCancelled');
    };

    $scope.popoverEee = 'Allemagne, Autriche, Belgique, Bulgarie, Chypre, Croatie, Danemark, Espagne, Estonie, Finlande, ' +
        'France, Grèce, Hongrie, Irlande, Islande, Italie, Lettonie, Liechtenstein, Lituanie, Luxembourg, Malte, Norvège, Pays-Bas, ' +
        'Pologne, Portugal, République Tchèque, Roumanie, Royaume-Uni, Slovaquie, Slovénie, Suède.';
});

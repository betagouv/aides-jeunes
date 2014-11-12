'use strict';

angular.module('ddsApp').controller('FoyerIndividuFormCtrl', function($scope, options, situationsFamiliales, SituationService, IndividuService) {
    $scope.options = options;
    $scope.statutsSpecifiques = IndividuService.getStatutsSpecifiques();
    $scope.selectedStatuts = {};
    $scope.situationsMaritales = _.filter(situationsFamiliales, 'isSituationCouple');

    $scope.individu = {
        nationalite: 'fr',
        assPreconditionRemplie: true,
        tauxInvalidite: 'moins50',
        boursier: false,
        role: options.individuRole
    };

    if (true === ($scope.captureRelationConjoint = !!options.captureRelationConjoint)) {
        $scope.individu.relationType = 'mariage';
    }

    if (_.contains(['demandeur', 'conjoint'], options.individuRole)) {
        var situation = SituationService.restoreLocal();
        var individu = _.find(situation.individus, { role: options.individuRole });
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

            $scope.$emit('individu.' + options.individuRole, $scope.individu);
        }
    };

    $scope.captureEligibiliteAss = function() {
        /* jshint -W069 */
        return _.contains(['demandeur', 'conjoint'], options.individuRole) && $scope.selectedStatuts['demandeur_emploi'];
    };

    $scope.captureTauxInvalidite = function() {
        return _.contains(['demandeur', 'conjoint'], options.individuRole) && $scope.selectedStatuts.handicap;
    };

    $scope.captureEtudiantBoursier = function() {
        return $scope.selectedStatuts.etudiant;
    };

    $scope.popoverEee = 'Allemagne, Autriche, Belgique, Bulgarie, Chypre, Croatie, Danemark, Espagne, Estonie, Finlande, ' +
        'France, Grèce, Hongrie, Irlande, Islande, Italie, Lettonie, Liechtenstein, Lituanie, Luxembourg, Malte, Norvège, Pays-Bas, ' +
        'Pologne, Portugal, République Tchèque, Roumanie, Royaume-Uni, Slovaquie, Slovénie, Suède.';
});

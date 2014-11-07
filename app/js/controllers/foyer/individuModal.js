'use strict';

angular.module('ddsApp').controller('FoyerIndividuModalCtrl', function($scope, $modalInstance, SituationService, IndividuService, options) {
    $scope.options = options;
    $scope.relationTypes = SituationService.relationTypeLabels;
    $scope.statutsSpecifiques = IndividuService.getStatutsSpecifiques();
    $scope.selectedStatuts = {};

    $scope.individu = { nationalite: 'fr', assPreconditionRemplie: true, tauxInvalidite: 'moins50', boursier: false };

    if (true === ($scope.askRelationType = !!options.askRelationType)) {
        $scope.individu.relationType = 'mariage';
    }

    $scope.submit = function(form) {
        $scope.submitted = true;
        if (form.$valid) {
            $scope.individu.situationsPro = [];
            _.forEach($scope.selectedStatuts, function(selected, statut) {
                if (selected) {
                    var situationPro = {situation: statut};
                    $scope.individu.situationsPro.push(situationPro);
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

            $scope.$emit('individu.' + options.individuType, $scope.individu);
            $modalInstance.close($scope.individu);
        }
    };

    $scope.captureEligibiliteAss = function() {
        var field = 'demandeur_emploi';
        return _.contains(['demandeur', 'conjoint'], options.individuType) && $scope.selectedStatuts[field];
    };

    $scope.captureTauxInvalidite = function() {
        return _.contains(['demandeur', 'conjoint'], options.individuType) && $scope.selectedStatuts['handicap'];
    };

    $scope.captureEtudiantBoursier = function() {
        return $scope.selectedStatuts['etudiant'];
    };

    $scope.popoverEee = 'Allemagne, Autriche, Belgique, Bulgarie, Chypre, Croatie, Danemark, Espagne, Estonie, Finlande, ' +
        'France, Grèce, Hongrie, Irlande, Islande, Italie, Lettonie, Liechtenstein, Lituanie, Luxembourg, Malte, Norvège, Pays-Bas, ' +
        'Pologne, Portugal, République Tchèque, Roumanie, Royaume-Uni, Slovaquie, Slovénie, Suède.';
});

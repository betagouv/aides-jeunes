'use strict';

angular.module('ddsApp').controller('FoyerIndividuModalCtrl', function($scope, $modalInstance, SituationService, options) {
    $scope.modalTitle = options.modalTitle;
    $scope.nationalite = 'fr';
    $scope.askFirstName = !!options.askFirstName;
    $scope.cancelable = !!options.cancelable;
    $scope.relationTypes = SituationService.relationTypeLabels;

    if (true === ($scope.askRelationType = !!options.askRelationType)) {
        $scope.relationType = 'mariage';
    }

    $scope.checkResidenceStability = options.checkResidenceStability;

    $scope.submit = function(form) {
        $scope.formSubmitted = true;
        if (form.$valid) {
            var individu = { birthDate: $scope.birthDate, nationalite: $scope.nationalite };
            if ($scope.askFirstName) {
                individu.firstName = $scope.firstName;
            }
            if ($scope.askRelationType) {
                individu.relationType = $scope.relationType;
            }

            $scope.$emit('individu.' + options.individuType, individu);
            $modalInstance.close(individu);
        }
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.popoverEee = 'Allemagne, Autriche, Belgique, Bulgarie, Chypre, Croatie, Danemark, Espagne, Estonie, Finlande, ' +
        'France, Grèce, Hongrie, Irlande, Islande, Italie, Lettonie, Liechtenstein, Lituanie, Luxembourg, Malte, Norvège, Pays-Bas, ' +
        'Pologne, Portugal, République Tchèque, Roumanie, Royaume-Uni, Slovaquie, Slovénie, Suède.';
});

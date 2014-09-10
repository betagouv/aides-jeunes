'use strict';

angular.module('ddsApp').controller('FoyerIndividuModalCtrl', function($scope, $modalInstance, SituationService, options) {
    $scope.modalTitle = options.modalTitle;
    $scope.askFirstName = !!options.askFirstName;
    $scope.cancelable = !!options.cancelable;
    $scope.checkResidenceStability = !!options.checkResidenceStability;
    $scope.maxAge = options.maxAge;
    $scope.minAge = options.minAge;
    $scope.relationTypes = SituationService.relationTypeLabels;

    $scope.individu = { nationalite: 'fr' };
    if (true === ($scope.askRelationType = !!options.askRelationType)) {
        $scope.individu.relationType = 'mariage';
    }

    $scope.submit = function(form) {
        $scope.submitted = true;
        if (form.$valid) {
            $scope.$emit('individu.' + options.individuType, $scope.individu);
            $modalInstance.close($scope.individu);
        }
    };

    $scope.popoverEee = 'Allemagne, Autriche, Belgique, Bulgarie, Chypre, Croatie, Danemark, Espagne, Estonie, Finlande, ' +
        'France, Grèce, Hongrie, Irlande, Islande, Italie, Lettonie, Liechtenstein, Lituanie, Luxembourg, Malte, Norvège, Pays-Bas, ' +
        'Pologne, Portugal, République Tchèque, Roumanie, Royaume-Uni, Slovaquie, Slovénie, Suède.';
});

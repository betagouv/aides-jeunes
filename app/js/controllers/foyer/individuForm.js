'use strict';

angular.module('ddsApp').controller('FoyerIndividuFormCtrl', function($scope, individuRole, situationsFamiliales, specificSituations, SituationService, IndividuService) {
    $scope.specificSituations = specificSituations;
    $scope.today = moment().format();

    $scope.options = {
        maxAge: 130
    };

    if (individuRole == 'enfant') {
        $scope.options.displayCancelButton = true;
        $scope.options.captureGardeAlternee = true;
        $scope.options.capturePrenom = true;

        $scope.specificSituations = _.filter($scope.specificSituations, function(statut) {
          return (statut.id !== 'retraite') && (statut.id !== 'perteAutonomie');
        });
    }

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

    var DEFAULT_INDIVIDU = {
        nationalite: 'fr',
        assPreconditionRemplie: false,
        scolarite: 'college',
        tauxIncapacite: 'plus80',
        boursier: false,
        aCharge: (individuRole == 'enfant'), // By default enfants are `à charge fiscale`, adults are not.
        fiscalementIndependant: true,
        place: false,
        role: individuRole,
        autresRevenusTnsActiviteType: 'bic',
        microEntrepriseActiviteType: 'bic',
        perteAutonomie: false,
        autoEntrepreneurActiviteType: 'bic',
        specificSituations: []
    };

    var isIndividuParent = IndividuService.isRoleParent(individuRole);
    $scope.individu = isIndividuParent && _.find($scope.situation.individus, { role: individuRole }) || _.cloneDeep(DEFAULT_INDIVIDU);

    $scope.individu.specificSituations.forEach(function(specificSituation) {
        $scope.selectedStatuts[specificSituation.situation] = true;
    });

    if (individuRole == 'conjoint') {
        $scope.individu.statutMarital = 'mariage';
    }

    $scope.submit = function(form) {
        $scope.submitted = true;
        if (form.$valid) {
            $scope.individu.specificSituations = [];

            _.forEach($scope.selectedStatuts, function(selected, statut) {
                if (selected) {
                    $scope.individu.specificSituations.push({ situation: statut });
                }
            });

            if (! $scope.captureEligibiliteAss()) {
                delete $scope.individu.assPreconditionRemplie;
            }

            if (! $scope.captureTauxIncapacite()) {
                delete $scope.individu.tauxIncapacite;
            }

            if (! $scope.captureEtudiantBoursier()) {
                delete $scope.individu.boursier;
            }

            if (! $scope.captureScolarite(form)) {
                delete $scope.individu.scolarite;
            }

            $scope.$emit('individu.' + individuRole, $scope.individu);
        }
    };

    $scope.isDemandeurMineur = function(form) {
        return individuRole == 'demandeur' && form.dateDeNaissance.$valid && IndividuService.age($scope.individu) < 18 ;
    };

    $scope.captureEligibiliteAss = function() {
        /* jshint -W069 */
        return isIndividuParent && $scope.selectedStatuts['demandeur_emploi'];
    };

    $scope.captureTauxIncapacite = function() {
        return $scope.selectedStatuts.handicap;
    };

    $scope.captureEnfantPlace = function() {
        return ! isIndividuParent && $scope.selectedStatuts.handicap;
    };

    $scope.captureEtudiantBoursier = function() {
        return $scope.selectedStatuts.etudiant;
    };

    $scope.captureDemandeurACharge = function() {
        var age = IndividuService.age($scope.individu);
        return individuRole == 'demandeur' && (age >= 18) && (age < 25);
    };

    $scope.captureEnfantACharge = function(form) {
        if (! isIndividuParent && form.dateDeNaissance.$valid) {
            return IndividuService.age($scope.individu) >= 1;
        }
    };

    $scope.capturePerteAutonomie = false;

    $scope.$watch('individu.dateDeNaissance', _.debounce(function() {
        $scope.capturePerteAutonomie = $scope.individu.dateDeNaissance &&
                                       $scope.individu.dateDeNaissance.isValid() &&
                                       IndividuService.age($scope.individu) >= 60;
        $scope.$digest();
    }, 400)); // avoid displaying question when user born in 1980 is typing 19… as birth year

    $scope.captureScolarite = function(form) {
        if (! isIndividuParent && form.dateDeNaissance.$valid) {
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

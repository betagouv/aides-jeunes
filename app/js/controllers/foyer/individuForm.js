'use strict';

function findIndividu(individus, role, params) {
    // In case of "demandeur" or "conjoint", the role is sufficient
    var predicate = { role: role };
    // For children, we also need to match the id
    if (role === 'enfant' && ! params.hasOwnProperty('id')) {
        return;
    }
    if (params.hasOwnProperty('id')) {
        predicate = _.assign(predicate, { id: params.id });
    }

    return _.find(individus, predicate);
}

angular.module('ddsApp').controller('FoyerIndividuFormCtrl', function($scope, $stateParams, individuRole, situationsFamiliales, specificSituations, IndividuService, NationaliteService) {

    $scope.specificSituations = specificSituations;
    $scope.situationsFamiliales = situationsFamiliales;
    $scope.today = moment();
    $scope.currentYear = $scope.today.format('YYYY');
    $scope.maxAgeYears = 130;
    $scope.minBirthDate = moment().subtract($scope.maxAgeYears, 'years');
    $scope.getZone = NationaliteService.getZone;

    if (individuRole == 'enfant') {
        $scope.displayCancelButton = true;
        $scope.captureGardeAlternee = true;
        $scope.capturePrenom = true;

        $scope.specificSituations = _.filter($scope.specificSituations, function(statut) {
            return (statut.id !== 'retraite');
        });
    }

    $scope.selectedStatuts = {};
    $scope.scolariteOptions = [
        {
            value: 'inconnue',
            label: 'Aucun des deux'
        },
        {
            value: 'college',
            label: 'Au collège'
        },
        {
            value: 'lycee',
            label: 'Au lycée / En CAP / En CPA'
        }
    ];

    $scope.tauxIncapaciteOptions = [
        {
            value: 0.3,
            label: 'Moins de 50%'
        },
        {
            value: 0.7,
            label: 'Entre 50% et 80%'
        },
        {
            value: 0.9,
            label: 'Plus de 80%'
        }
    ];

    $scope.GIROptions = [
        {
            value: 'gir_6',
            label: 'Jamais',
        },
        {
            value: 'gir_5',
            label: 'Ponctuellement',
        },
        {
            value: 'gir_1',
            label: 'Régulièrement'
        }
    ];

    $scope.residentialPermitLabel = {
        autre: 'En possession d‘une carte de résident ou d‘un titre de séjour valide',
        ue: 'En possession d‘un <a target="_blank" rel="noopener" href="https://www.service-public.fr/particuliers/vosdroits/F2651">droit au séjour</a> valide',
    };


    var isIndividuParent = IndividuService.isRoleParent(individuRole);


    $scope.individu.specificSituations.forEach(function(specificSituation) {
        $scope.selectedStatuts[specificSituation] = true;
    });

    $scope.submit = function(form) {
        $scope.submitted = true;
        if (form.$valid) {
            $scope.individu.specificSituations = [];

            _.forEach($scope.selectedStatuts, function(selected, statut) {
                if (selected) {
                    $scope.individu.specificSituations.push(statut);
                }
            });

            if (! $scope.captureDureePossessionTitreSejour()) {
                delete $scope.individu.duree_possession_titre_sejour;
            }

            if (! $scope.captureEligibiliteAss()) {
                delete $scope.individu.ass_precondition_remplie;
                delete $scope.individu.date_debut_chomage;
            }

            if (! $scope.captureTauxIncapacite()) {
                delete $scope.individu.taux_incapacite;
            }

            if (! $scope.captureRestrictionSubstantielleDurableAccesEmploi()) {
                delete $scope.individu.aah_restriction_substantielle_durable_acces_emploi;
            }

            if (! $scope.captureScolarite(form)) {
                delete $scope.individu.scolarite;
            }

            $scope.$emit('individu.' + individuRole, $scope.individu);
        }
    };

    $scope.isDemandeurMineur = function(form) {
        return individuRole == 'demandeur' && form && form.dateDeNaissance.$valid && IndividuService.age($scope.individu) < 18 ;
    };

    $scope.captureOutOfFranceQuestions = function() {
        return $scope.individu.role == 'demandeur' && $scope.individu.nationalite != 'FR';
    };

    $scope.captureDureePossessionTitreSejour = function() {
        var zone = $scope.getZone($scope.individu.nationalite);
        return $scope.captureOutOfFranceQuestions() &&
            $scope.locals.satisfyResidentialDurationPrerequisite &&
            $scope.locals.satisfyResidentialPermitPrerequisite[zone];
    };

    $scope.captureEligibiliteAss = function() {
        return isIndividuParent && $scope.selectedStatuts['chomeur'];
    };

    $scope.captureTauxIncapacite = function() {
        return $scope.selectedStatuts.handicap;
    };

    $scope.captureRestrictionSubstantielleDurableAccesEmploi = function() {
        return $scope.captureTauxIncapacite() && isIndividuParent && $scope.individu.taux_incapacite == 0.7;
    };

    $scope.captureEnfantPlace = function() {
        return ! isIndividuParent && $scope.selectedStatuts.handicap;
    };

    $scope.captureDemandeurACharge = function() {
        var age = IndividuService.age($scope.individu);
        return individuRole == 'demandeur' && (age >= 18) && (age < 25);
    };

    $scope.captureEnfantACharge = function(form) {
        if (! isIndividuParent && form && form.dateDeNaissance.$valid) {
            return IndividuService.age($scope.individu) >= 1;
        }
    };

    $scope.capturePerteAutonomie = false;

    $scope.locals = {
        fiscalementIndependant: ! $scope.individu.enfant_a_charge[$scope.currentYear],
        satisfyResidentialDurationPrerequisite: Boolean(existingIndividu) && existingIndividu.nationalite != 'FR',
        satisfyResidentialPermitPrerequisite: {}
    };
    $scope.locals.satisfyResidentialPermitPrerequisite[existingIndividu && $scope.getZone(existingIndividu.nationalite)] = true;

    $scope.$watch('individu.date_naissance', _.debounce(function() {
        $scope.capturePerteAutonomie = $scope.individu.date_naissance &&
                                       $scope.individu.date_naissance.isValid() &&
                                       IndividuService.age($scope.individu) >= 60;
        $scope.$digest();
    }, 400)); // avoid displaying question when user born in 1980 is typing 19… as birth year

    function fiscalementIndependantUpdated() {
        $scope.individu.enfant_a_charge[$scope.currentYear] = ! $scope.locals.fiscalementIndependant;
    }

    $scope.$watch('locals.fiscalementIndependant', fiscalementIndependantUpdated);

    $scope.captureScolarite = function(form) {
        if (! isIndividuParent && form && form.dateDeNaissance && form.dateDeNaissance.$valid) {
            var age = IndividuService.age($scope.individu);
            return age <= 25 && age > 8;
        }

        return false;
    };

    $scope.cancel = function() {
        $scope.$emit('actionCancelled');
    };
});

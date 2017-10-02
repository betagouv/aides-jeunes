'use strict';

angular.module('ddsApp').controller('FoyerIndividuFormCtrl', function($scope, individuRole, situationsFamiliales, specificSituations, SituationService, IndividuService) {
    $scope.specificSituations = specificSituations;
    $scope.situationsFamiliales = situationsFamiliales;
    $scope.today = moment();
    $scope.currentYear = $scope.today.format('YYYY');
    $scope.maxAgeYears = 130;
    $scope.minBirthDate = moment().subtract($scope.maxAgeYears, 'years');

    if (individuRole == 'enfant') {
        $scope.displayCancelButton = true;
        $scope.captureGardeAlternee = true;
        $scope.capturePrenom = true;

        $scope.specificSituations = _.filter($scope.specificSituations, function(statut) {
          return (statut.id !== 'retraite') && (statut.id !== 'perte_autonomie');
        });
    }

    $scope.selectedStatuts = {};
    $scope.scolariteOptions = [
        {
            value: 'Inconnue',
            label: 'Aucun des deux'
        },
        {
            value: 'Collège',
            label: 'Au collège'
        },
        {
            value: 'Lycée',
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
            value: 'Gir 6',
            label: 'Jamais',
        },
        {
            value: 'Gir 5',
            label: 'Ponctuellement',
        },
        {
            value: 'Gir 1',
            label: 'Régulièrement'
        }
    ];

    $scope.outOfFranceDisclaimers = {
        autre: 'Détenteur d‘une carte de résident ou d‘un titre de séjour valide et résidant en France plus de 9 mois par an.',
        ue: 'Détenteur d‘un droit au séjour valide et résidant en France plus de 9 mois par an.',
    };

    var DEFAULT_INDIVIDU = {
        id: individuRole,
        nationalite: 'fr',
        ass_precondition_remplie: false,
        scolarite: 'Collège',
        taux_incapacite: 0.9,
        echelon_bourse: -1,
        enfant_a_charge: {},
        enfant_place: false,
        gir: 'Gir 6',
        role: individuRole,
        tns_autres_revenus_type_activite: 'bic',
        tns_micro_entreprise_type_activite: 'bic',
        perte_autonomie: false,
        tns_auto_entrepreneur_type_activite: 'bic',
        specificSituations: []
    };
    // By default enfants are `à charge fiscale`, adults are not.
    DEFAULT_INDIVIDU.enfant_a_charge[$scope.currentYear] = (individuRole == 'enfant');

    // Required on DEFAULT_INDIVIDU to properly restore statut_marital
    if (DEFAULT_INDIVIDU.role == 'conjoint') {
        DEFAULT_INDIVIDU.statut_marital = 'Marié';  // Marié(e)
    }

    var isIndividuParent = IndividuService.isRoleParent(individuRole);
    $scope.individu = isIndividuParent && _.find($scope.situation.individus, { role: individuRole }) || _.cloneDeep(DEFAULT_INDIVIDU);

    if (individuRole == 'enfant') {
        var nextEnfantCount = $scope.enfants.length + 1;
        $scope.individu.firstName = 'Votre ' + nextEnfantCount + (nextEnfantCount === 1 ? 'ᵉʳ' : 'ᵉ' ) + ' enfant';

        var usedIds = $scope.enfants.map(function(enfant) { return enfant.id; });
        var count = 0;
        while (_.indexOf(usedIds, 'enfant_' + count) >= 0) {
            count = count + 1;
        }
        $scope.individu.id = 'enfant_' + count;
    }

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

            if (! $scope.captureEligibiliteAss()) {
                delete $scope.individu.ass_precondition_remplie;
            }

            if (! $scope.captureTauxIncapacite()) {
                delete $scope.individu.taux_incapacite;
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

    $scope.locals = {
        fiscalementIndependant: ! $scope.individu.enfant_a_charge[$scope.currentYear],
        outOfFranceDisclaimers: {},
    };
    if ($scope.individu.nationalite) {
        $scope.locals.outOfFranceDisclaimers[$scope.individu.nationalite] = true;
    }

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

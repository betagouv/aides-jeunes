/* global angular, situation, _, situationId, rsa, aideLogement, moment, _s */
var ddsApp = angular.module('ddsApp', []);

function findBestQuestion(computingError) {
    var entity = computingError.entity;
    var entityType = entity instanceof situation.Individu ? 'Individu' : 'Logement';
    var claimedAttribute = computingError.claimedAttributes[0];
    return questions[entityType][claimedAttribute];
}

var aides = {
    aspa: {
        type: Number,
        partial: 'à l\'Allocation de solidarité aux personnes âgées'
    },
    acs: {
        type: Number,
        partial: 'à l\'Aide pour une Complémentaire Santé'
    },
    cmu_c: {
        type: Boolean,
        partial: 'à la Couverture Maladie Universelle complémentaire'
    },
    apl: {
        type: Number,
        partial: 'à l\'Aide Personnalisée au Logement'
    },
    als: {
        type: Number,
        partial: 'l\'Allocation de Logement Social'
    },
    alf: {
        type: Number,
        partial: 'l\'Allocation de Logement Familial'
    },
    rsa: {
        type: Number,
        partial: 'au Revenu de Solidarité Active'
    }
};

ddsApp.controller('mainCtrl', function ($scope, $http) {
    function overrideDemandeur(data) {
        $scope.demandeur = situation.expand(data);
        $scope.computeSituation();
    }

    $http.get('/api/situations/' + situationId).success(overrideDemandeur).error(function(data, status) {
        if (status === 404) {
            $scope.demandeur = new situation.Individu();
            $scope.demandeur.ajouteLogement();
            $scope.computeSituation();
        }
    });

    $scope.updateSituation = function () {
        $http.put('/api/situations/' + situationId, situation.flatten($scope.demandeur)).success(overrideDemandeur);
    };

    $scope.computeSituation = function() {
        console.log('Computing...');
        $scope.elig = {};
        try {
            $scope.demandeur.get('statutMarital');
            $scope.demandeur.get('dateDeNaissance');
            $scope.demandeur.get('retraite');
            if ($scope.demandeur.conjoint) {
                $scope.demandeur.conjoint.get('dateDeNaissance');
                $scope.demandeur.conjoint.get('retraite');
            }
            $scope.demandeur.get('enfants');
            $scope.elig.rsa = rsa.estEligibleRSA($scope.demandeur);
            $scope.elig.aideLogement = aideLogement.estEligibleAideLogement($scope.demandeur);
            $scope.demandeur.ressourcesTroisDerniersMois();
            if ($scope.demandeur.conjoint) $scope.demandeur.conjoint.ressourcesTroisDerniersMois();
            if ($scope.demandeur.enfants) _.forEach($scope.demandeur.enfants, function(enfant) {
                enfant.get('retraite');
                enfant.ressourcesTroisDerniersMois();
            });
            delete $scope.computingError;
            console.log('Computed!', $scope.elig);
            $scope.simulate();
        } catch(e) {
            if (!(e instanceof situation.ComputingError)) throw e;
            console.log('Computing error', e);
            $scope.computingError = e;
        }
    };

    $scope.simulate = function () {
        console.log('Simulating...');
        $http.get('/api/situations/' + situationId + '/simulation').success(function(data) {
            $scope.aides = [];
            _.forEach(data, function(value, aide) {
                if (!(aide in aides)) return;
                var obj = { partial: aides[aide].partial };
                if (aides[aide].type === Number && value > 0) {
                    obj.montant = value;
                    $scope.aides.push(obj);
                }
                if (aides[aide].type === Boolean && value === true) {
                    $scope.aides.push(obj);
                }
            });
            console.log('Simulated!', data);
        });
    };
});

var iconMap = {
    Individu: 'user',
    Logement: 'home'
};

ddsApp.controller('questionCtrl', function ($scope) {
    function updateQuestion() {
        $scope.question = angular.copy(findBestQuestion($scope.computingError));
        $scope.questionTmpl = '/partials/questions/' + $scope.question.type + '.html';
        $scope.targetEntity = $scope.computingError.entity;
        $scope.question.icon = iconMap[$scope.targetEntity.constructor.name];

        if ($scope.targetEntity === $scope.demandeur) $scope.question.mainTitle = 'Vous';
        if ($scope.targetEntity === $scope.demandeur.conjoint) $scope.question.mainTitle = 'Votre conjoint';
        if ($scope.targetEntity === $scope.demandeur.logement) $scope.question.mainTitle = 'Votre logement principal';
        if ($scope.targetEntity.prenom) $scope.question.mainTitle = $scope.targetEntity.prenom;

        $scope.claimedAttribute = $scope.computingError.claimedAttributes[0];
        $scope.next = function() {
            if ($scope.question.afterCallback) {
                if($scope.question.afterCallback.apply($scope.targetEntity) !== false) {
                    $scope.updateSituation();
                }
            } else {
                $scope.updateSituation();
            }
        };
    }

    $scope.$watchGroup(['computingError', 'targetEntity'], function() {
        updateQuestion();
    });

    updateQuestion();
});



ddsApp.controller('ressourcesQuestionCtrl', function ($scope) {
    $scope.periodes = situation.troisDerniersMois();
    $scope.moment = moment;
    $scope._s = _s;

    function updateIndividu() {
        $scope.individu = $scope.targetEntity;
        $scope.individu.construitTroisDerniersMois();
        $scope.selecting = true;
        $scope.ressourcesSelected = {};
        $scope.ressources = situation.Individu.ressources;
        $scope.ressourcesCount = 0;
    }

    $scope.selectRessource = function(ressource) {
        $scope.ressourcesSelected[ressource] = true;
        _.forEach($scope.periodes, function(periode) {
            $scope.individu.ressources[periode][ressource] = 0;
        });
        $scope.ressourcesCount++;
    };

    $scope.removeRessource = function(ressource) {
        delete $scope.ressourcesSelected[ressource];
        _.forEach($scope.periodes, function(periode) {
            delete $scope.individu.ressources[periode][ressource];
        });
        $scope.ressourcesCount--;
    };

    updateIndividu();

    $scope.$watch('targetEntity', function() {
        updateIndividu();
    });
});

ddsApp.controller('yesNoQuestionCtrl', function () {});
ddsApp.controller('dateQuestionCtrl', function () {});
ddsApp.controller('numberQuestionCtrl', function () {});
ddsApp.controller('radiosQuestionCtrl', function () {});
ddsApp.controller('checkboxesQuestionCtrl', function () {});
ddsApp.controller('enfantsQuestionCtrl', function () {});

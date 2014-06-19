/* global ddsApp */
function findBestQuestion(entity, questionName) {
    console.log(entity);
    var entityType = entity instanceof situation.Individu ? 'Individu' : 'Logement';
    return questions[entityType][questionName];
}

var aides = prestations;

ddsApp.controller('mainCtrl', function ($scope, $http, $routeParams, $location) {
    $scope.questionName = $routeParams.questionName ? _s.camelize($routeParams.questionName) : undefined;
    $scope.entityId = $routeParams.entityId;

    $http.get('/api/situations/' + $routeParams.situationId).success(function(data) {
        $scope.demandeur = situation.expand(data);
        if (!$routeParams.entityId || !$routeParams.questionName) $scope.computeSituation();
    });

    $scope.situationId = $routeParams.situationId;

    $scope.updateSituation = function () {
        $http.put('/api/situations/' + $routeParams.situationId, situation.flatten($scope.demandeur)).success(function(data) {
            $scope.demandeur = situation.expand(data);
            $scope.computeSituation();
        });
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
            if ($scope.demandeur.enfants) {
                _.forEach($scope.demandeur.enfants, function(enfant) {
                    enfant.get('retraite');
                    enfant.ressourcesTroisDerniersMois();
                });
            }

            console.log('Computed!', $scope.elig);
            $scope.simulate();
        } catch(e) {
            if (!(e instanceof situation.ComputingError)) throw e;
            $location.path('/configuration/' + $routeParams.situationId + '/' + e.entity.id + '/' + _s.dasherize(e.claimedAttributes[0]));
            console.log('Computing error', e);
        }
    };

    $scope.simulate = function () {
        console.log('Simulating...');
        $http.get('/api/situations/' + $routeParams.situationId + '/simulation').success(function(data) {
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
        if (!$scope.demandeur || !$scope.entityId || !$scope.questionName) return;
        $scope.targetEntity = situation.searchByEntityId($scope.demandeur, $scope.entityId);
        $scope.question = angular.copy(findBestQuestion($scope.targetEntity, $scope.questionName));
        $scope.questionTmpl = '/partials/questions/' + $scope.question.type + '.html';
        $scope.question.icon = iconMap[$scope.targetEntity.constructor.name];

        if ($scope.targetEntity === $scope.demandeur) $scope.question.mainTitle = 'Vous';
        if ($scope.targetEntity === $scope.demandeur.conjoint) $scope.question.mainTitle = 'Votre conjoint';
        if ($scope.targetEntity === $scope.demandeur.logement) $scope.question.mainTitle = 'Votre logement principal';
        if ($scope.targetEntity.prenom) $scope.question.mainTitle = $scope.targetEntity.prenom;

        $scope.claimedAttribute = $scope.questionName;
        $scope.next = function() {
            if ($scope.question.afterCallback) {
                if ($scope.question.afterCallback.apply($scope.targetEntity) !== false) {
                    $scope.updateSituation();
                }
            } else {
                $scope.updateSituation();
            }
        };
    }

    $scope.$watchGroup(['demandeur', 'questionName', 'entityId'], function() {
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

ddsApp.controller('envoiDemandeCtrl', function ($http, $scope, $routeParams) {
    $scope.contact = {};
    $scope.send = function (form) {
        $scope.formSubmitted = true;
        if (form.$invalid) {
            return;
        }

        $http.put('/api/situations/' + $routeParams.situationId, {contact: $scope.contact}).success(function() {
            $scope.formSent = true;
        });
    };
});

ddsApp.controller('homepageCtrl', function($scope, $window, $http, $location) {
    $scope.checkConfirmation = function() {
        if (!$scope.acceptConditions) {
            $window.alert('Vous devez cocher la case pour continuer');
            return false;
        }
        return true;
    };

    $scope.startSimulation = function() {
        $http.post('/api/situations').success(function(situationId) {
            $location.path('/configuration/' + situationId);
        });
    };
});

ddsApp.controller('marqueBlancheCtrl', function ($scope, $window) {
    if ($window.location.pathname.indexOf('/secours-populaire/') === 0) {
        $scope.logo = 'logo_secours_populaire.png';
    }
});

ddsApp.controller('yesNoQuestionCtrl', function () {});
ddsApp.controller('dateQuestionCtrl', function () {});
ddsApp.controller('numberQuestionCtrl', function () {});
ddsApp.controller('radiosQuestionCtrl', function () {});
ddsApp.controller('checkboxesQuestionCtrl', function () {});
ddsApp.controller('enfantsQuestionCtrl', function () {});

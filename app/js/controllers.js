var ddsApp = angular.module('ddsApp', []);
var s = { demandeur: new situation.Individu(), elig: {} };
s.demandeur.ajouteLogement();

function updateSituation() {
    s.elig = {};
    s.computingError = null;

    try {
        throw new situation.ComputingError(['ressources'], s.demandeur);
        s.elig.rsa = rsa.estÉligibleRSA(s.demandeur);
        s.elig.aideLogement = aideLogement.estEligibleAideLogement(s.demandeur);
    } catch(e) {
        if (!(e instanceof situation.ComputingError)) throw e;
        s.computingError = e;
    }
}

var questions = {
    Individu: {
        enceinte: {
            type: 'yes-no',
            label: 'Attendez-vous un enfant ?'
        },
        boursierEnseignementSup: {
            type: 'yes-no',
            label: 'Percevez-vous une bourse de l\'enseignement supérieur ?'
        },
        statusMarital: {
            type: 'radios',
            label: 'Quelle est votre situation familiale actuelle ?',
            values: {
                'seul': 'Seul',
                'en couple': 'En couple',
                'pacsé': 'Pacsé(e)',
                'marié': 'Marié(e)'
            },
            afterCallback: function() {
                if (!this.statusMarital) return;
                if (this.statusMarital === 'seul') {
                    this.seul();
                } else {
                    this.enCouple(this.statusMarital);
                }
            }
        },
        dateDeNaissance: {
            type: 'date',
            label: 'Quelle est votre date de naissance ?'
        },
        enfants: {
            type: 'enfants',
            label: 'Vos enfants :',
            afterCallback: function() {
                if (!this.enfants) this.enfants = [];
                var error = false;
                this.enfants.forEach(function(enfant) {
                    if (!enfant.prenom || !enfant.prenom.length) error = true;
                    if (!enfant.dateDeNaissance) error = true;
                });
                return !error;
            }
        },
        ressources: {
            type: 'ressources',
            label: 'Au cours des 3 derniers mois, quels types de ressources avez-vous perçus ?'
        }
    },
    Logement: {
        prêtEnCours: {
            type: 'yes-no',
            label: 'Remboursez-vous un emprunt pour financer votre logement ?'
        },
        prochePropriétaire: {
            type: 'yes-no',
            label: 'Un membre de votre famille est-il le propriétaire de votre logement ?'
        },
        loyer: {
            type: 'number',
            label: 'À combien s\'élève votre loyer (ou votre mensualité d\'emprunt) ?'
        },
        codePostal: {
            type: 'number',
            label: 'Quel est le code postal de votre lieu de résidence ?'
        },
        statusOccupation: {
            type: 'radios',
            label: 'Concernant votre logement, êtes-vous ?',
            values: {
                'locataire': 'Locataire',
                'proprietaire': 'Propriétaire',
                'gratuit': 'Occupant à titre gratuit'
            }
        }
    }
};

var statusQuestion = {
    type: 'checkboxes',
    label: 'Êtes-vous dans l\'une ou l\'autre de ces situations particulières ?',
    sub: 'Vous pouvez cochez plusieurs cases, ou aucune.',
    values: situation.Individu.status
};

_.forEach(situation.Individu.status, function(label, attribute) {
    questions.Individu[attribute] = statusQuestion;
});

function findBestQuestion(computingError) {
    var entity = computingError.entity;
    var entityType = entity instanceof situation.Individu ? 'Individu' : 'Logement';
    var claimedAttribute = computingError.claimedAttributes[0];
    return questions[entityType][claimedAttribute];
}

ddsApp.controller('mainCtrl', function ($scope) {
    $scope.situation = s;
    updateSituation();
});

var iconMap = {
    Individu: 'user',
    Logement: 'home'
};

ddsApp.controller('questionCtrl', function ($scope) {
    function updateQuestion() {
        $scope.question = angular.copy(findBestQuestion($scope.situation.computingError));
        $scope.questionTmpl = '/partials/questions/' + $scope.question.type + '.html';
        $scope.targetEntity = $scope.situation.computingError.entity;
        $scope.question.icon = iconMap[$scope.targetEntity.constructor.name];

        if ($scope.targetEntity === s.demandeur) $scope.question.mainTitle = 'Vous';
        if ($scope.targetEntity === s.demandeur.conjoint) $scope.question.mainTitle = 'Votre conjoint';
        if ($scope.targetEntity === s.demandeur.logement) $scope.question.mainTitle = 'Votre logement principal';
        if ($scope.targetEntity.prenom) $scope.question.mainTitle = $scope.targetEntity.prenom;

        $scope.claimedAttribute = $scope.situation.computingError.claimedAttributes[0];
        $scope.next = function() {
            if ($scope.question.afterCallback) {
                if($scope.question.afterCallback.apply($scope.targetEntity) !== false) {
                    updateSituation();
                }
            } else {
                updateSituation();
            }
        }
    }

    $scope.$watch('situation.computingError', function() {
        updateQuestion();
    });

    updateQuestion();
});



ddsApp.controller('ressourcesQuestionCtrl', function ($scope) {
    $scope.individu = $scope.targetEntity;
    $scope.individu.construitTroisDerniersMois();
    $scope.periodes = situation.troisDerniersMois();
    $scope.moment = moment;
    $scope._s = _s;
    $scope.selecting = true;
    $scope.ressourcesSelected = {};
    $scope.ressources = situation.Individu.ressources;
    $scope.ressourcesCount = 0;

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
});

ddsApp.controller('yesNoQuestionCtrl', function () {});
ddsApp.controller('dateQuestionCtrl', function () {});
ddsApp.controller('numberQuestionCtrl', function () {});
ddsApp.controller('radiosQuestionCtrl', function () {});
ddsApp.controller('checkboxesQuestionCtrl', function () {});
ddsApp.controller('enfantsQuestionCtrl', function () {});

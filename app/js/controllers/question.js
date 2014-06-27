'use strict';

angular.module('ddsApp').controller('QuestionCtrl', function ($scope) {
    var iconMap = {
        Individu: 'user',
        Logement: 'home'
    };

    function findBestQuestion(entity, questionName) {
        var entityType = entity instanceof situation.Individu ? 'Individu' : 'Logement';
        return questions[entityType][questionName];
    }

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

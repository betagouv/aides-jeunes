'use strict';

var SmoothScroll = require('smooth-scroll');
var forEachBenefit = require('../../../backend/lib/mes-aides').forEach;

var scroll = new SmoothScroll();

var choices = [
    { value: 'already', label: "J'en bénéficiais déjà" },
    { value: 'asked',   label: "J'ai fait une demande" },
    { value: 'failed',  label: "Je n'ai pas réussi à faire une demande" },
    { value: 'nothing', label: "Je n'ai rien fait" },
];

function isNegative(value) {
    return value === 'failed' || value === 'nothing';
}

var scrollOptions = {
    updateURL: false,
    popstate: false,
    speed: 500,
    speedAsDuration: true,
    header: 'header.navbar-fixed-top'
};

angular.module('ddsApp').controller('SuiviCtrl', function($http, $scope, $stateParams, $timeout) {

    $http.get('/api/followups/surveys/' + $stateParams.token)
        .then(function(response) {

            var followup = response.data;

            var benefitsIds = followup.benefits.map(benefit => benefit.id);

            var benefitsNormalized = [];

            $scope.createdAt = moment(followup.createdAt).format('ll');

            forEachBenefit((benefit, benefitId, provider, providerId) => {

                if (! benefitsIds.includes(benefitId)) {
                    return;
                }

                var montant = _.find(followup.benefits, benefit => benefit.id === benefitId).amount;

                benefitsNormalized.push(_.assign({},
                    benefit,
                    {
                        id: benefitId,
                        montant: montant,
                        provider: provider,
                        providerId: providerId,
                        choices: choices,
                        choiceValue: null,
                        choiceComments: ''
                    }
                ));
            });

            $scope.droits = benefitsNormalized;
        });

    $scope.isComplete = false;
    $scope.hiddenChoices = [];

    $scope.checkComplete = function(droit, force) {

        var choiceValues = _.map($scope.droits, droit => droit.choiceValue);
        $scope.isComplete = (_.filter(choiceValues).length === $scope.droits.length);

        if (! isNegative(droit.choiceValue) || true === force) {

            $scope.hiddenChoices.push(droit.id);

            var next = _.find($scope.droits, droit => droit.choiceValue === null);
            if (next) {
                scroll.animateScroll(document.querySelector(`#${next.id}`), null, scrollOptions);
            } else {
                scroll.animateScroll(document.querySelector('button[type="submit"]'), null, scrollOptions);
            }
        } else {
            $timeout(() => document.querySelector(`#${droit.id} textarea`).focus(), 250);
        }
    };

    $scope.isHidden = function(droit) {
        return _.includes($scope.hiddenChoices, droit.id);
    };

    $scope.modify = function(e, droit) {
        e.preventDefault();
        $scope.hiddenChoices = _.filter($scope.hiddenChoices, item => item !== droit.id);
    };

    $scope.isNumber = _.isNumber;
    $scope.isString = _.isString;
    $scope.getFractionSize = function(droit) {
        return droit.floorAt < 1 ? 2 : 0;
    };

    $scope.submitted = false;

    $scope.submit = function() {

        var answers = $scope.droits.map(droit => ({
            id: droit.id,
            value: droit.choiceValue,
            comments: droit.choiceComments
        }));

        $http.post('/api/followups/surveys/' + $stateParams.token + '/answers', answers)
            .then(function(response) {
                if (response.status === 201) {
                    $scope.submitted = true;
                }
            });
    };

    $scope.isNegative = isNegative;
});

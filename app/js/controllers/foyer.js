'use strict';

angular.module('ddsApp').controller('FoyerCtrl', function($scope, $state, $stateParams, $filter, $location, SituationService, IndividuService) {
    var situation = $scope.situation = SituationService.restoreLocal();

    $scope.restoreRemoteSituation = function(situationId) {
        return SituationService.restoreRemote(situationId)
            .then(function(persistedSituation) {
                situation = $scope.situation = persistedSituation;
                $scope.$broadcast('newSituation');
                return situation;
            });
    };

    $scope.persistLocalSituation = function() {
        return SituationService.save(situation).then(function(situation) { return situation._id; })
            .then(SituationService.restoreRemote)
            .then(function(persistedSituation) {
                situation = $scope.situation = persistedSituation;
                return situation;
            });
    };

    $scope.statutsSpecifiques = IndividuService.formatStatutsSpecifiques;
    $scope.nationalite = IndividuService.nationaliteLabel;
    $scope.getLabel = IndividuService.label;

    $scope.$on('individu.demandeur', function(e, demandeur) {
        if (_.find(situation.individus, { role: 'demandeur' })) {
            situation.individus[0] = demandeur;
        } else {
            situation.individus.push(demandeur);
        }
        $state.go('foyer.enfants');
    });

    $scope.$on('individu.conjoint', function(e, conjoint) {
        SituationService.setConjoint(situation, conjoint);

        var demandeur = SituationService.getDemandeur(situation);
        demandeur.statut_marital = conjoint.statut_marital;

        $state.go('foyer.logement');
    });

    $scope.$on('enfant', function(e, enfants) {
        SituationService.setEnfants(situation, enfants);
    });

    $scope.$on('enfants', function(e, enfants) {
        SituationService.setEnfants(situation, enfants);
        $state.go('foyer.conjoint');
    });

    $scope.$on('logement', function() {
        $scope.$broadcast('logementCaptured');
        $state.go('foyer.ressources.individu.types', { individu: 0 });
    });

    $scope.$on('pensionsAlimentaires', function() {
        $scope.$broadcast('ressourcesUpdated');
        $state.go('foyer.resultat');
    });

    $scope.$on('rnc', function() {
        $scope.$broadcast('ym2Captured');
        // si un enfant est scolarisé on demande son rfr (bourses collège/lycée), sinon pas besoin
        if (SituationService.hasEnfantScolarise($scope.situation)) {
            $state.go('foyer.rfr');
        } else {
            $state.go('foyer.resultat');
        }
    });

    $scope.$on('rfr', function() {
        $scope.$broadcast('ym2Captured');
        $state.go('foyer.resultat');
    });

    $scope.$on('patrimoine', function() {
        $scope.$broadcast('patrimoineCaptured');
        $state.go('foyer.resultat');
    });

    $scope.downloadAsPdf = function() {

        var baseURL = window.location.protocol
            + '//' + window.location.hostname
            + (window.location.port ? (':' + window.location.port) : '');

        var documentElement = document.documentElement.cloneNode(true);

        var body = documentElement.querySelector('body');
        var scripts = documentElement.querySelectorAll('body > script');

        // Remove Piwik script to avoid CORS errors with PhantomJS
        var scriptsToFilter = _.filter(scripts, function(script) {
            if (script.innerHTML.match(/piwik/gm)) {
                return true;
            }

            return script.src.match(/piwik/g);
        });
        _.forEach(scriptsToFilter, function(script) {
            body.removeChild(script);
        });

        // Convert some links to absolute to have a correct rendering

        var stylesheets = documentElement.querySelectorAll('link');
        _.forEach(stylesheets, function (stylesheet) {
            stylesheet.setAttribute('href', baseURL + stylesheet.getAttribute('href'));
        });
        var images = documentElement.querySelectorAll('img');
        _.forEach(images, function (image) {
            image.setAttribute('src', baseURL + image.getAttribute('src'));
        });

        var base64 = window.btoa(unescape(encodeURIComponent(documentElement.innerHTML)));

        $scope.base64 = base64;

        setTimeout(function() {
            document.getElementById("download").submit();
        }, 2000);
    };
});

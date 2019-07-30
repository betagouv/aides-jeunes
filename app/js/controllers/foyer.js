'use strict';

angular.module('ddsApp').controller('FoyerCtrl', function($scope, $state, $filter, $http, $location, $q, ResultatService, SituationService, IndividuService) {
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

    $scope.awaitingResults = ResultatService.isLoading();
    $scope.$on('resultat:loading:changed', function(event, loading) {
        $scope.awaitingResults = loading;
    });

    $scope.downloadAsPdf = function() {

        var baseURL = window.location.protocol
            + '//' + window.location.hostname
            + (window.location.port ? (':' + window.location.port) : '');

        var documentElement = document.documentElement.cloneNode(true);

        var body = documentElement.querySelector('body');
        var scripts = documentElement.querySelectorAll('body > script');

        // Remove some scripts to avoid CORS errors with PhantomJS
        var scriptsToFilter = _.filter(scripts, function(script) {
            if (script.innerHTML.match(/piwik/gm)) {
                return true;
            }

            return script.src.match(/piwik/g)
                || script.src.match(/webpack-dev-server\.js/g)
                || script.src.match(/livereload\.js/g)
                || script.src.match(/localhost:/g);
        });

        _.forEach(scriptsToFilter, function(script) {
            body.removeChild(script);
        });

        // Convert some links to absolute to have a correct rendering
        var images = documentElement.querySelectorAll('img');
        _.forEach(images, function (image) {
            image.setAttribute('src', baseURL + image.getAttribute('src'));
        });

        var stylesheets = documentElement.querySelectorAll('link[rel="stylesheet"]');
        var promises = _.map(stylesheets, function (stylesheet) {
            var promise = $http.get(stylesheet.getAttribute('href'));
            stylesheet.parentNode.removeChild(stylesheet);

            return promise;
        });

        $q.all(promises)
            .then(function(values) {
                // Inline styles
                _.forEach(values, function(response) {
                    var style = document.createElement('style');
                    style.innerHTML = response.data.replace(/url\(\/fonts/g, 'url(' + baseURL + '/fonts');
                    documentElement.querySelector('head').appendChild(style);
                });
            })
            .then(function() {
                $scope.base64 = window.btoa(unescape(encodeURIComponent(documentElement.outerHTML)));

                setTimeout(function() {
                    document.getElementById("download").submit();
                }, 2000);
            });
    };

    $scope.followupSubmitted = false;
    $scope.followupError = false;
    $scope.submitFollowup = function(form) {
        var email = form.email.$modelValue;
        var situation = SituationService.restoreLocal();
        $http.post('api/situations/' + situation._id + '/followup', {
            email: email,
        }).then(function() {
            $scope.followupSubmitted = true;
            $scope.followupError = false;
        }).catch(function() {
            $scope.followupSubmitted = true;
            $scope.followupError = true;
        });
    };
});

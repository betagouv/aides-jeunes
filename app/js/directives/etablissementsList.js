'use strict';

function normalizeEtablissement(etablissementFeature) {
    var etablissement = etablissementFeature.properties;

    if (etablissement.url === 'https://www.maisondeservicesaupublic.fr') {
        delete etablissement.url;
    }

    if (etablissement.horaires) {
        var mapping = {
            lundi: 1,
            mardi: 2,
            mercredi: 3,
            jeudi: 4,
            vendredi: 5,
            samedi: 6,
            dimanche: 7
        };
        etablissement.horaires = _.sortBy(etablissement.horaires, function(plage) {
            return mapping[plage.du];
        });
    }

    etablissement.adresse = _.find(etablissement.adresses, { type: 'physique' });
    if (! etablissement.adresse) {
        etablissement.adresse = _.find(etablissement.adresses, { type: 'géopostale' });
    }
    if (! etablissement.adresse) {
        etablissement.adresse = etablissement.adresses[0];
    }

    return etablissement;
}

angular.module('ddsApp').directive('etablissementsList', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/etablissements-list.html',
        scope: {
            codeInsee: '=',
            codePostal: '='
        },
        controller: 'etablissementsListCtrl',
    };
});

angular.module('ddsApp').controller('etablissementsListCtrl', function($http, $interval, $scope, CityService) {
    function getEtablissements() {
        if (! $scope.codePostal) {
            return;
        }

        CityService
            .getCities($scope.codePostal)
            .then(function(cities) { return _.find(cities, { codeInsee: $scope.codeInsee }); })
            .then(function(city) { return city; })
            .then(function(city) { return $http.get('https://etablissements-publics.api.gouv.fr/v3/communes/' + city.codeInsee + '/ccas+cdas+sdsei+edas+msap+maison_handicapees'); })
            .then(function(response) { return response.data.features; }, function() { return []; })
            .then(function(etablissements) {
                $scope.etablissements = etablissements.map(normalizeEtablissement);
            });
    }

    ['codeInsee', 'codePostal'].forEach(function(key) {
        $scope.$watch(key, getEtablissements);
    });

    $scope.extractHHMM = function(dateString) {
        return dateString.slice(0,5);
    };

    getEtablissements();
});

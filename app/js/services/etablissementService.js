'use strict';

// Make sure to require Mingo for the browser
var mingo = require('mingo/dist/mingo');

// Sorted by relevancy
var defaultEtablissementTypes = [
    'ccas',
    'cdas',
    'sdsei',
    'edas',
    'centre_social',
    'msap',
];

var etablissementFilters = [
    {
        // One of the individuals has specific situation "handicap"
        query: { individus: { $elemMatch: { specificSituations: "handicap" } } },
        types: ['maison_handicapees']
    }
];

angular.module('ddsCommon').factory('EtablissementService', function($http, CityService) {

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

    function getEtablissementTypesBySituation(situation) {

        var etablissementTypes = [];
        _.forEach(etablissementFilters, function(etablissementFilter) {
            var query = new mingo.Query(etablissementFilter.query);
            if (query.test(situation)) {
                etablissementTypes = etablissementTypes.concat(etablissementFilter.types);
            }
        });

        return defaultEtablissementTypes.concat(etablissementTypes);
    }

    function getEtablissements(situation, codePostal, codeInsee) {
        return CityService
            .getCities(codePostal)
            .then(function(cities) { return _.find(cities, { codeInsee: codeInsee }); })
            .then(function(city) { return city; })
            .then(function(city) {
                var etablissementTypes = getEtablissementTypesBySituation(situation);

                return $http.get('https://etablissements-publics.api.gouv.fr/v3/communes/' + city.codeInsee + '/' + etablissementTypes.join('+'));
            })
            .then(function(response) { return response.data.features; }, function() { return []; })
            .then(function(etablissements) {
                return etablissements.map(normalizeEtablissement);
            });
    }

    return {
        getEtablissements: getEtablissements,
        getEtablissementTypesBySituation: getEtablissementTypesBySituation
    };
});

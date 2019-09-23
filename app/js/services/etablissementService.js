'use strict';

// Make sure to require Mingo for the browser
var mingo = require('mingo/dist/mingo');

// Sorted by relevancy
var defaultEtablissementTypes = [
    'mairie',
    'mds',
    'ccas',
    'cdas',
    'centre_social',
    'edas',
    'sdsei',
    'msap',
];

var born25YearsAgo = moment().subtract(25, 'years');
var born16YearsAgo = moment().subtract(16, 'years');

var etablissementFilters = [
    {
        // One of the individuals has specific situation "handicap"
        query: { individus: { $elemMatch: { specificSituations: "handicap" } } },
        types: ['maison_handicapees']
    },
    {
        // The applicant is between 16 & 25 years old
        query: {
            individus: {
                $elemMatch: {
                    id: 'demandeur',
                    date_naissance: {
                        $gte: born25YearsAgo,
                        $lte: born16YearsAgo,
                    }
                }
            }
        },
        types: ['mission_locale'],
        prepend: true
    }
];

angular.module('ddsCommon').factory('EtablissementService', function($http, $q) {

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
        var etablissementTypes = defaultEtablissementTypes.slice();

        _.forEach(etablissementFilters, function(etablissementFilter) {
            var query = new mingo.Query(etablissementFilter.query);
            if (query.test(situation)) {
                if (etablissementFilter.prepend) {
                    etablissementTypes = etablissementFilter.types.concat(etablissementTypes);
                } else {
                    etablissementTypes = etablissementTypes.concat(etablissementFilter.types);
                }
            }
        });

        return etablissementTypes;
    }

    function getEtablissements(city, types) {
        if (! types || ! types.length) {
            return $q.resolve([]);
        }

        var url = 'https://mes-aides.gouv.fr/annuaire-api/v3/communes/' + city + '/' + types.join('+');
        return $http.get(url)
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

'use strict';

var NATIONALITES = require('../constants/nationalites');

var NATIONALITE_LABEL = {
    'fr': 'française',
    'ue': 'UE',
    'autre': 'hors UE'
};

var EU_COUNTRY_CODES = [
    'AT',
    'BE',
    'BG',
    'CY',
    'CZ',
    'DE',
    'DK',
    'EE',
    'ES',
    'FI',
    'FR',
    'GR',
    'HR',
    'HU',
    'IE',
    'IS',
    'IT',
    'LI',
    'LT',
    'LV',
    'LU',
    'NO',
    'MT',
    'NL',
    'PL',
    'PT',
    'RO',
    'UK',
    'SE',
    'SI',
    'SK',
];

angular.module('ddsCommon').factory('NationaliteService', function() {
    // @see https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
    function normalizeString(text) {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    return {
        normalizeString,
        getList: function() {
            return NATIONALITES;
        },
        getSortedArray: function() {

            var nationalites = _.map(NATIONALITES, function(value, key) {
                return {
                    code: key,
                    name: value,
                    key: normalizeString(value)
                };
            });

            nationalites.sort(function(a, b) {
                return a.key < b.key ? -1 : 1;
            });

            var index = _.findIndex(nationalites, function(nationalite) {
                return nationalite.code === 'FR';
            });
            var spliced = nationalites.splice(index, 1);
            nationalites.unshift(spliced[0]);

            return nationalites;
        },
        getLabel: function(nationalite) {
            return NATIONALITE_LABEL[nationalite];
        },
        getNationaliteByCountryCode: function(countryCode) {

            countryCode = countryCode.toUpperCase();

            if (countryCode === 'FR') {
                return 'fr';
            }
            if (EU_COUNTRY_CODES.includes(countryCode)) {
                return 'ue';
            }

            return 'autre';
        }
    };
});

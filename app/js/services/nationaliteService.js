'use strict';

var NATIONALITES = require('../constants/nationalites');

var NATIONALITE_LABEL = {
    'fr': 'française',
    'ue': 'UE',
    'autre': 'hors UE'
};

var EU_COUNTRY_CODES = [
    'DE',
    'AT',
    'BE',
    'BG',
    'CY',
    'HR',
    'DK',
    'ES',
    'EE',
    'FI',
    'FR',
    'GR',
    'HU',
    'IE',
    'IS',
    'IT',
    'LV',
    'LI',
    'LT',
    'LU',
    'MT',
    'NO',
    'NL',
    'PL',
    'PT',
    'CZ',
    'RO',
    'UK',
    'SK',
    'SI',
    'SE',
];

angular.module('ddsCommon').factory('NationaliteService', function() {

    return {
        getList: function() {
            return NATIONALITES;
        },
        getSortedArray: function() {

            var nationalites = _.map(NATIONALITES, function(value, key) {
                return {
                    code: key,
                    name: value
                };
            });

            nationalites.sort(function(a, b) {
                return a.name < b.name ? -1 : 1;
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

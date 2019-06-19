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

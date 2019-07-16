'use strict';

var NATIONALITES = require('../constants/nationalites');

var removeDiacritics = require('diacritics').remove;

var NATIONALITE_LABEL = {
    'fr': 'française',
    'ue': 'UE',
    'autre': 'hors UE'
};

var EEE_COUNTRY_CODES = [
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
    'LU',
    'LV',
    'MT',
    'NL',
    'NO',
    'PL',
    'PT',
    'RO',
    'SE',
    'SI',
    'SK',
    'UK',
];

angular.module('ddsCommon').factory('NationaliteService', function() {
    function normalizeString(text) {
        return removeDiacritics(text).toLowerCase();
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
            if (EEE_COUNTRY_CODES.includes(countryCode) || countryCode === 'CH') {
                return 'ue';
            }

            return 'autre';
        }
    };
});

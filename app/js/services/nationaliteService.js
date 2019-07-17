'use strict';

var Fuse = require('fuse.js');

var NATIONALITES = require('../constants/nationalites');
var PAYS = require('../constants/pays');

// TODO Some keys are missing
var combined = _.mapValues(NATIONALITES, function(value, key) {
    if (PAYS.hasOwnProperty(key)) {
        return {
            nationalite: value,
            pays: PAYS[key]
        };
    }
});

var searchItems = _.map(combined, function(value, key) {
    return _.assign(value, { code: key });
});

var fuseOptions = {
    shouldSort: true,
    threshold: 0.5,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        "nationalite",
        "pays"
    ]
};
var fuse = new Fuse(searchItems, fuseOptions);

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

    return {
        toArray: function() {
            return searchItems;
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
        },
        getCountryCodeByNationalite: function(nationalite) {

            switch (nationalite) {
            case 'ue':
                return 'DE';
            case 'autre':
                return 'AF';
            }

            return 'FR';
        },
        search: function(q) {
            return fuse.search(q).slice(0, 10);
        }
    };
});

'use strict';

var Fuse = require('fuse.js');

var worldCountries = require('world-countries');

var countries = [];

worldCountries.forEach(function(country) {
    if (country.hasOwnProperty('demonyms')) {
        countries.push({
            code: country.cca2,
            commonName: country.translations.fra.common,
            demonym: country.demonyms.fra.f,
            officialName: country.translations.fra.official,
        });
    }
});

var fuseOptions = {
    shouldSort: true,
    threshold: 0.5,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        "commonName",
        "demonym",
        "officialName"
    ]
};
var fuse = new Fuse(countries, fuseOptions);

var ZONE_LABEL = {
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

function getZone(countryCode) {

    countryCode = countryCode.toUpperCase();

    if (countryCode === 'FR') {
        return 'fr';
    }
    if (EEE_COUNTRY_CODES.includes(countryCode) || countryCode === 'CH') {
        return 'ue';
    }

    return 'autre';
}

angular.module('ddsCommon').factory('NationaliteService', function() {

    return {
        toArray: function() {
            return countries;
        },
        getLabel: function(nationalite) {
            return ZONE_LABEL[getZone(nationalite)];
        },
        getZone: getZone,
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

let ZONE_LABEL = {
    'fr': 'française',
    'ue': 'UE',
    'autre': 'hors UE'
};

let EEE_COUNTRY_CODES = [
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

const Nationality = {
    getLabel: function(nationality) {
        return ZONE_LABEL[getZone(nationality)];
    },
    getZone: getZone,
    getCountryCodeByNationality: function(nationality) {

        switch (nationality) {
        case 'ue':
            return 'DE';
        case 'autre':
            return 'AF';
        }

        return 'FR';
    }
}

export default Nationality

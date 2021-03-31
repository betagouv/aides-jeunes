var moment = require('moment');
var isNaN = require('lodash/isNaN');
var forEach = require('lodash/forEach');
var isUndefined = require('lodash/isUndefined');
var cloneDeep = require('lodash/cloneDeep');
var isString = require('lodash/isString');

var individuRessource = require('./ressources');
var pastResourcesProxy = require('./pastResourcesProxy');

function formatDate(date) {
    return date && moment(date).format('YYYY-MM-DD');
}

var individuSchema = {
    date_naissance: {
        src: 'date_naissance',
        fn: formatDate
    },
    age: {
        src: 'date_naissance',
        fn: function (dateDeNaissance, individu, situation) {
            return dateDeNaissance && moment(situation.dateDeValeur).diff(moment(dateDeNaissance), 'years');
        }
    },
    age_en_mois: {
        src: 'date_naissance',
        fn: function (dateDeNaissance, individu, situation) {
            return dateDeNaissance && moment(situation.dateDeValeur).diff(moment(dateDeNaissance), 'months');
        }
    },
    date_arret_de_travail: {
        src: 'date_arret_de_travail',
        fn: formatDate
    },
    date_debut_chomage: {
        src: 'date_debut_chomage',
        fn: formatDate
    },
};

function isNotValidValue(value) {
    return isNaN(value) || isUndefined(value) || value === null || value === "Invalid date";
}

function buildOpenFiscaIndividu(mesAidesIndividu, situation) {
    var openFiscaIndividu = cloneDeep(mesAidesIndividu);
    forEach(individuSchema, function(definition, openfiscaKey) {
        var params = isString(definition) ? { src: definition } : definition;

        openFiscaIndividu[openfiscaKey] = params.src ? params.fn(mesAidesIndividu[params.src], mesAidesIndividu, situation) : params.fn(mesAidesIndividu, situation);

        // Remove null as OpenFisca do not handle them correctly
        if (isNotValidValue(openFiscaIndividu[openfiscaKey])) {
            delete openFiscaIndividu[openfiscaKey];
        }
    });

    individuRessource.computeRessources(mesAidesIndividu, openFiscaIndividu);
    pastResourcesProxy(openFiscaIndividu, situation);
    return openFiscaIndividu;
}

buildOpenFiscaIndividu.additionalProps = individuSchema;
module.exports = buildOpenFiscaIndividu;

import axios from 'axios'
import {categoriesRnc, ressourceTypes} from '@/constants/resources'
import { getPeriods } from '@/../backend/lib/openfisca/mapping/common'
import moment from 'moment'
import _ from 'lodash'


function getPeriodKeysForCurrentYear(dateDeValeur, ressourceType) {
    var periodKeys = [];
    var lastYear = moment(dateDeValeur).subtract(1, 'years').format('YYYY');
    if (ressourceType.isMontantAnnuel)
    {
        periodKeys.push(lastYear);
        return periodKeys;
    }
    if (ressourceType.id == 'tns_auto_entrepreneur_chiffre_affaires')
    {
        periodKeys.push(lastYear);
        periodKeys = periodKeys.concat(_.map(getPeriods(dateDeValeur).last3Months, 'id'));
    } else {
        periodKeys = periodKeys.concat(_.map(getPeriods(dateDeValeur).last12Months, 'id'));
    }

    if (! ressourceType.revenuExceptionnel) {
        periodKeys.push(moment(dateDeValeur).format('YYYY-MM'));
    }

    return periodKeys;
}

function setDefaultValueForCurrentYear(dateDeValeur, individu, ressourceType) {
    var ressourceId = ressourceType.id;
    individu[ressourceId] = individu[ressourceId] || {};
    var ressource = individu[ressourceId];
    var periodKeys = getPeriodKeysForCurrentYear(dateDeValeur, ressourceType);

    if (_.some(periodKeys, function(periodKey) { return _.isNumber(ressource[periodKey]); })) {
        return;
    }

    periodKeys.forEach(function(periodKey) {
        ressource[periodKey] = ressource[periodKey] || 0;
    });
}

function unsetForCurrentYear(dateDeValeur, entity, ressourceType) {
    var ressourceId = ressourceType.id;
    entity[ressourceId] = entity[ressourceId] || {};
    var ressource = entity[ressourceId];
    var periodKeys = getPeriodKeysForCurrentYear(dateDeValeur, ressourceType);
    periodKeys.forEach(function(periodKey) {
        delete ressource[periodKey];
    });

    if (_.isEmpty(ressource)) {
        delete entity[ressourceId];
    }
}

var ressourcesForTrailingMonthsAndFiscalYear = categoriesRnc.filter(function(fiscalRessource) {
    return fiscalRessource.sources && fiscalRessource.sources.indexOf(fiscalRessource.id) >= 0;
}).map(function(fiscalRessource) { return fiscalRessource.id; });

function isSelectedForCurrentYear(ressource, ressourceIdOrType) {
    // A single value means that a SINGLE value has been specified for the FISCAL year
    // Multiple values means that current year values were specified
    if (ressourcesForTrailingMonthsAndFiscalYear.indexOf(ressourceIdOrType.id || ressourceIdOrType) >= 0) {
        return _.keys(ressource).length > 1;
    }

    return Boolean(ressource);
}

function getIndividuRessourceTypes(individu) {
    return _.filter(ressourceTypes, isRessourceOnMainScreen)
        .reduce((accumulator, ressourceType) => {
            accumulator[ressourceType.id] = isSelectedForCurrentYear(individu[ressourceType.id], ressourceType)
            return accumulator
        }, {})
}

function setIndividuRessourceTypes(individu, types, dateDeValeur) {
    var typeMap = _.keyBy(_.filter(ressourceTypes, isRessourceOnMainScreen), 'id');

    Object.keys(types).forEach(function(ressourceTypeId) {
        if (types[ressourceTypeId]) {
            individu[ressourceTypeId] = individu[ressourceTypeId] || {};
        } else {
            unsetForCurrentYear(dateDeValeur, individu, typeMap[ressourceTypeId]);
        }
    })
}

function isRessourceOnMainScreen(ressourceOrType) {
    // Make this function robust so that it can be called with a type from the ressourceTypes constant, or just a string.
    var type = ressourceOrType.id || ressourceOrType;
    return type != 'pensions_alimentaires_versees_individu';
}

function getParameterFromOpenfisca(parameterId) {
    return axios.get('/api/parameters/' + parameterId)
        .then(function(resp) {
            var values = resp.data.values;
            var sortedByDates = Object.keys(values).sort();
            var latestValue = values[sortedByDates.pop()];
            return latestValue;
        });
}

const Ressource = {
    getPeriodKeysForCurrentYear,
    isRessourceOnMainScreen,
    isSelectedForCurrentYear,
    setDefaultValueForCurrentYear,
    getIndividuRessourceTypes,
    setIndividuRessourceTypes,
    unsetForCurrentYear,
    getParameterFromOpenfisca
}

export default Ressource

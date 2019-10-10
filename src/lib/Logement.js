import { logementTypes, locationTypes } from '../constants/logement'
import _ from 'lodash'

function getStatutOccupationLogement(logement) {
    var statusOccupationMap = {
        proprietaireprimoaccedant: 'primo_accedant',
        proprietaire: 'proprietaire',
        locatairenonmeuble: 'locataire_vide',
        locatairemeublehotel: 'locataire_meuble',
        heberge: 'loge_gratuitement',
        locatairefoyer: 'locataire_foyer',
        sansDomicile : 'sans_domicile'
    };
    var statusOccupationId = logement.type;
    if (logement.type == 'proprietaire' && logement.primoAccedant) {
        statusOccupationId = 'proprietaireprimoaccedant';
    } else if (logement.type == 'locataire' && logement.locationType) {
        statusOccupationId += logement.locationType;
    }
    return statusOccupationMap[statusOccupationId];
}

function getLogementVariables(statusOccupationId) {
    var baseLogementMap = {
        primo_accedant:
            { type: 'proprietaire', primoAccedant: true },
        proprietaire:
            { type: 'proprietaire', primoAccedant: false },
        locataire_vide:
            { type: 'locataire', locationType: 'nonmeuble' },
        locataire_meuble:
            { type: 'locataire', locationType: 'meublehotel' },
        loge_gratuitement:
            { type: 'heberge' },
        locataire_foyer:
            { type: 'locataire', locationType: 'foyer' },
        sans_domicile:
            { type: 'sansDomicile' },
    };
    return (statusOccupationId && baseLogementMap[statusOccupationId]) || {};
}

function getLabels(statusOccupationId) {
    var logement = getLogementVariables(statusOccupationId);
    var logementLabel = _.find(logementTypes, { id: logement.type }).label;

    //TODO logementLabel = logementLabel.$filter('uppercaseFirst')();
    var recapLogement = '<b>' + logementLabel + '</b>';
    var loyerLabel;
    if ('locataire' === logement.type) {
        recapLogement += ' d’un logement <b>';
        recapLogement += _.find(locationTypes, { id: logement.locationType }).label;
        recapLogement += '</b>';
        loyerLabel = 'Loyer';
    } else {
        loyerLabel = 'Mensualité d’emprunt';
        if (logement.primoAccedant) {
            recapLogement += ' en accession';
        }
    }

    return {
        loyerLabel: loyerLabel,
        recapLogement: recapLogement,
    };
}

const Logement = {
    getLabels,
    getLogementVariables,
    getStatutOccupationLogement,
}

export default Logement

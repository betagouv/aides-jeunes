import { logementTypes, locationTypes } from '../constants/logement'
import _ from 'lodash'

function getStatutOccupationLogement(logement) {
    let statusOccupationMap = {
        proprietaireprimoaccedant: 'primo_accedant',
        proprietaire: 'proprietaire',
        locatairenonmeuble: 'locataire_vide',
        locatairemeublehotel: 'locataire_meuble',
        heberge: 'loge_gratuitement',
        locatairefoyer: 'locataire_foyer',
        sansDomicile : 'sans_domicile'
    };
    let statusOccupationId = logement.type;
    if (logement.type == 'proprietaire' && logement.primoAccedant) {
        statusOccupationId = 'proprietaireprimoaccedant';
    } else if (logement.type == 'locataire' && logement.locationType) {
        statusOccupationId += logement.locationType;
    }
    return statusOccupationMap[statusOccupationId];
}

function getLogementVariables(statusOccupationId) {
    let baseLogementMap = {
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
    }
    let base = statusOccupationId && baseLogementMap[statusOccupationId]
    return { type: undefined, primoAccedant: undefined, locationType: undefined, ...base }
}

function getLabels(statusOccupationId) {
    let logement = getLogementVariables(statusOccupationId);
    let logementLabel = _.find(logementTypes, { id: logement.type }).label;

    //TODO3 logementLabel = logementLabel.$filter('uppercaseFirst')();
    let recapLogement = '<b>' + logementLabel + '</b>';
    let loyerLabel;
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

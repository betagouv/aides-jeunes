'use strict';

angular.module('ddsApp').service('LogementService', function($filter, logementTypes, locationTypes) {
    // cf. https://legislation.openfisca.fr/statut_occupation_logement
    function getStatutOccupationLogement(logement) {
        var statusOccupationMap = {
            'proprietaireprimoaccedant': 'Accédant à la propriété',
            'proprietaire': 'Propriétaire (non accédant) du logement',
            'locatairenonmeuble': 'Locataire ou sous-locataire d‘un logement loué vide non-HLM',
            'locatairemeublehotel': 'Locataire ou sous-locataire d‘un logement loué meublé ou d‘une chambre d‘hôtel',
            'heberge': 'Logé gratuitement par des parents, des amis ou l‘employeur',
            'locatairefoyer': 'Locataire d‘un foyer (résidence universitaire, maison de retraite, foyer de jeune travailleur, résidence sociale...)',
            'sansDomicile' : 'Sans domicile stable'
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
            'Accédant à la propriété':
                { type: 'proprietaire', primoAccedant: true },
            'Propriétaire (non accédant) du logement':
                { type: 'proprietaire', primoAccedant: false },
            'Locataire ou sous-locataire d‘un logement loué vide non-HLM':
                { type: 'locataire', locationType: 'nonmeuble' },
            'Locataire ou sous-locataire d‘un logement loué meublé ou d‘une chambre d‘hôtel':
                { type: 'locataire', locationType: 'meublehotel' },
            'Logé gratuitement par des parents, des amis ou l‘employeur':
                { type: 'heberge' },
            'Locataire d‘un foyer (résidence universitaire, maison de retraite, foyer de jeune travailleur, résidence sociale...)':
                { type: 'locataire', locationType: 'foyer' },
            'Sans domicile stable':
                { type: 'sansDomicile' },
        };
        return (statusOccupationId && baseLogementMap[statusOccupationId]) || {};
    }

    function getLabels(statusOccupationId) {
        var logement = getLogementVariables(statusOccupationId);
        var logementLabel = _.find(logementTypes, { id: logement.type }).label;

        logementLabel = $filter('uppercaseFirst')(logementLabel);
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
    return {
        getLabels: getLabels,
        getLogementVariables: getLogementVariables,
        getStatutOccupationLogement: getStatutOccupationLogement,
    };
});

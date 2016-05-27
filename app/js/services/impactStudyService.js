'use strict';

angular.module('ddsApp').service('ImpactStudyService', function($location, $http, $sessionStorage, $log, uuid) {
    var RESEARCH_DOMAIN = 'https://mes-droits.fr',  // this domain is owned by economy researchers mandated by Pole Emploi and DGCS
        STUDIED_PRESTATIONS = [ 'aah', 'aah_non_calculable', 'acs', 'adpa', 'af', 'aide_logement', 'aide_logement_non_calculable', 'alf', 'als', 'apl', 'asf', 'asi', 'aspa', 'ass', 'bourse_college', 'bourse_lycee', 'cf', 'cmu_c', 'paje_base', 'paris_logement_familles', 'ppa', 'rsa', 'rsa_majore', 'rsa_non_calculable', 'rsa_non_majore' ];


    function getSessionId() {
        $sessionStorage.sessionId = $sessionStorage.sessionId || uuid.v4();
        return $sessionStorage.sessionId;
    }

    function getResearchId() {
        $sessionStorage.researchId = $sessionStorage.researchId || $location.search().eid;
        return $sessionStorage.researchId;
    }

    function extractStudiedResults(openfiscaResults) {
        var result = {};

        STUDIED_PRESTATIONS.forEach(function(id) {
            result[id] = openfiscaResults[id];
        });

        return result;
    }

    function send(path, payload) {
        if (! getResearchId())
            return;  // this research is based on controlled cohorts; track only users that have a valid research ID opt-in

        /*jshint camelcase: false */
        payload.session_id = getSessionId();
        payload.eid = getResearchId();

        $http.post(RESEARCH_DOMAIN + path, payload)
             .success(function(res) { $log.info('Data transmitted to researchers', res); })
             .error(function(error) { $log.warn('Data could not be transmitted to researchers', error); });
    }

    return {
        sendResults: function(situation, openfiscaResults) {
            var payload = extractStudiedResults(openfiscaResults);
            payload.postcode = situation.logement.adresse.codePostal;

            send('/sr', payload);
        },

        sendPostCode: function(situation) {
            send('/cp', { postcode: situation.logement.adresse.codePostal });
        },

        sendVisitedPage: function() {
            /*jshint camelcase: false */
            send('/it', { url_visited: $location.absUrl() });
        }
    };
});

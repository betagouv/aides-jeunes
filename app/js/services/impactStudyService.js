'use strict';

angular.module('ddsCommon').service('ImpactStudyService', function($location, $http, $localStorage, $sessionStorage, $log, uuid) {
    var RESEARCH_DOMAIN = 'mes-droits.fr';  // this domain is owned by Poverty Lab researchers mandated by Pole Emploi and DGCS


    function getSessionId() {
        $sessionStorage.sessionId = $sessionStorage.sessionId || uuid.v4();
        return $sessionStorage.sessionId;
    }

    function resetSessionId() {
        $sessionStorage.sessionId = uuid.v4();
    }

    function getResearchId() {
        $localStorage.researchId = $localStorage.researchId || $location.search().eid;
        return $localStorage.researchId;
    }

    function send(path, payload) {
        if (! getResearchId())
            return;  // this research is based on controlled cohorts; track only users that have a valid research ID opt-in

        /*jshint camelcase: false */
        payload.session_id = getSessionId();
        payload.eid = getResearchId();

        $http.post('https://' + RESEARCH_DOMAIN + '/v1' + path, payload)
             .success(function(res) { $log.info('Data transmitted to researchers. For more info, see ' + RESEARCH_DOMAIN, res); })
             .error(function(error) { $log.warn('Data could not be transmitted to researchers', error); });
    }

    return {
        sendResults: function(situation, openfiscaResults) {
            var payload = {
                results: angular.copy(openfiscaResults.calculatedPrestations),
                postcode: situation.logement.adresse.codePostal,
            };

            send('/sr', payload);
        },

        sendPostCode: function(situation) {
            send('/cp', { postcode: situation.logement.adresse.codePostal });
        },

        sendVisitedPage: function() {
            /*jshint camelcase: false */
            send('/it', { url_visited: $location.absUrl() });
        },

        resetSessionId: resetSessionId
    };
});

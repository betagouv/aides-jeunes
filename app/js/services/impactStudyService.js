'use strict';

angular.module('ddsApp').service('ImpactStudyService', function($http, $sessionStorage) {

    var ENDPOINT = 'https://mes-droits.fr/sr';

    function getSessionId() {
            $sessionStorage.sessionId = $sessionStorage.sessionId ? $sessionStorage.sessionId : uuid.v1();
            return $sessionStorage.sessionId;
    }

    return {
        sendResults: function(eid, situation, openfiscaResults) {
            delete openfiscaResults['paris_complement_sante'];
            delete openfiscaResults['paris_energie_famille'];
            delete openfiscaResults['paris_forfait_famille'];
            delete openfiscaResults['paris_logement'];
            delete openfiscaResults['paris_logement_aspeh'];
            delete openfiscaResults['paris_logement_plfm'];
            delete openfiscaResults['paris_logement_psol'];

            var result = _.merge(openfiscaResults, {
                'session_id' : getSessionId(),
                'eid': eid,
                'postCode': situation.logement.adresse.codePostal
            });

            $http.post(ENDPOINT, result).success(function(data) {
               console.log("Results transmitted to the Survey API");
               console.log(data);
            }).error(function(error) {
                console.log("Error while transmitting results to the Survey API");
                console.log(error);
            });
        }
    };
});

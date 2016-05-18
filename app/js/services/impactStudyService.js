'use strict';

angular.module('ddsApp').service('ImpactStudyService', function($http) {

    return {
        sendResults: function(eid, situation, openfiscaResults) {
            delete openfiscaResults['paris_complement_sante'];
            delete openfiscaResults['paris_energie_famille'];
            delete openfiscaResults['paris_forfait_famille'];
            delete openfiscaResults['paris_logement'];
            delete openfiscaResults['paris_logement_aspeh'];
            delete openfiscaResults['paris_logement_plfm'];
            delete openfiscaResults['paris_logement_psol'];
        }
    };
});

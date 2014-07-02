'use strict';

angular.module('ddsApp').factory('SituationService', function($http, $sessionStorage) {
    return {
        find: function(situationId) {
            return $http.get('/api/situations/' + situationId).then(function(result) {
                return result.data;
            });
        },

        saveRemote: function(situation) {
            return $http.post('/api/situations', situation);
        },

        newSituation: function() {
            delete $sessionStorage.situation;
        },

        saveLocal: function(situation) {
            $sessionStorage.situation = situation;
        },

        restoreLocal: function() {
            var situation = $sessionStorage.situation;
            if (situation) {
                situation.demandeur.birthDate = moment(situation.demandeur.birthDate);
                if (situation.conjoint) {
                    situation.conjoint.birthDate = moment(situation.conjoint.birthDate);
                }

                _.forEach(situation.children, function(child) {
                    child.birthDate = moment(child.birthDate);
                });

                _.forEach(situation.personnesACharge, function(personne) {
                    personne.birthDate = moment(personne.birthDate);
                });
            }

            return situation;
        },

        createIndividusList: function(situation) {
            var individus = [
                {
                    name: 'Vous',
                    type: 'demandeur'
                }
            ];

            if (situation.conjoint) {
                individus.push({
                    name: 'Votre conjoint',
                    type: 'conjoint'
                });
            }

            _.forEach(situation.children, function(child) {
                individus.push({name: child.firstName, type: 'child'});
            });

            _.forEach(situation.personnesACharge, function(personne) {
                individus.push({name: personne.firstName, type: 'personneACharge'});
            });

            return individus;
        }
    };
});

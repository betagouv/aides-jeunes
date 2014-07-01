'use strict';

angular.module('ddsApp').factory('SituationService', function($http, $sessionStorage) {
    return {
        find: function(situationId) {
            return $http.get('/api/situations/' + situationId).then(function(result) {
                return result.data;
            });
        },

        update: function(situationId, data) {
            return $http.put('/api/situations/' + situationId, data);
        },

        saveLocal: function(situation) {
            $sessionStorage.situation = situation;
        },

        restoreLocal: function() {
            var situation = $sessionStorage.situation;
            situation.demandeur.birthDate = moment(situation.demandeur.birthDate);

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

            _.forEach(situation.personnes, function(personne) {
                individus.push({name: personne.firstName, type: 'personneACharge'});
            });

            return individus;
        }
    };
});

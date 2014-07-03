'use strict';

angular.module('ddsApp').factory('SituationService', function($http, $sessionStorage) {
    var situation;

    return {
        nationaliteLabels: {
            francaise: 'française',
            ue: 'UE',
            autre: 'hors UE'
        },

        relationTypeLabels: {
            mariage: 'marié(e)',
            pacs: 'pacsé(e)',
            relationLibre: 'en relation libre'
        },

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
            situation = null;
        },

        saveLocal: function(situation) {
            $sessionStorage.situation = situation;
        },

        restoreLocal: function() {
            if (!situation) {
                situation = $sessionStorage.situation || {};
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

            _.forEach(situation.enfants, function(child) {
                individus.push({name: child.firstName, type: 'child'});
            });

            _.forEach(situation.personnesACharge, function(personne) {
                individus.push({name: personne.firstName, type: 'personneACharge'});
            });

            return individus;
        }
    };
});

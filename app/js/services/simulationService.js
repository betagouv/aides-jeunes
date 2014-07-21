'use strict';

angular.module('ddsApp').factory('SimulationService', function($http, $q, SituationService) {
    return {
        simulate: function() {
            var situation = SituationService.restoreLocal();
            var deferred = $q.defer();
            var apiSituation = this.createApiCompatibleSituation(situation);
            var that = this;

            $http.get('/resources/droits.json').then(function(res) {
                $http.post('/api/situations', apiSituation).then(function(result) {
                    situation._id = result.data._id;
                    $http.get('/api/situations/' + result.data._id + '/simulation').then(function(droits) {
                        deferred.resolve({
                            situationId: result.data._id,
                            droits: that.createDroitsFromApiResult(droits.data, res.data)
                        });
                    }, function() {
                        deferred.reject();
                    });
                }, function() {
                    deferred.reject();
                });
            }, function() {
                deferred.reject();
            });
           

            return deferred.promise;
        },

        createApiCompatibleSituation: function(situation) {
            var individus = [situation.demandeur];
            situation.demandeur.role = 'demandeur';
            if (situation.conjoint) {
                individus.push(situation.conjoint);
                situation.conjoint.role = 'conjoint';
                situation.demandeur.statusMarital = situation.conjoint.relationType;
            }

            situation.enfants.forEach(function(enfant) {
                enfant.role = 'enfant';
            });

            situation.personnesACharge.forEach(function(personne) {
                personne.role = 'personneACharge';
            });

            individus = individus.concat(situation.enfants).concat(situation.personnesACharge);
            individus = _.map(individus, this.createApiCompatibleIndividu);

            var result = {
                individus: individus,
                logement: situation.logement
            };

            return result;
        },

        createApiCompatibleIndividu: function(individu) {
            individu = _.cloneDeep(individu);
            individu.dateDeNaissance = moment(individu.birthDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
            var ressources = individu.ressources;
            individu.ressources = [];

            _.forEach(ressources, function(months, type) {
                _.forEach(months, function(montant, month) {
                    individu.ressources.push({
                        montant: montant,
                        periode: month,
                        type: type
                    });
                });
            });

            return individu;
        },

        createDroitsFromApiResult: function(result, droitsList) {
            var droits = [];
            droitsList.forEach(function(droit) {
                var value = result[droit.id];
                if (value) {
                    var toInsert = { description: droit };
                    if (_.isNumber(value)) {
                        toInsert.montant = value;
                    }
                    droits.push(toInsert);
                }
            });

            return droits;
        }
    };
});

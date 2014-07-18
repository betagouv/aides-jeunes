'use strict';

angular.module('ddsApp').factory('SimulationService', function($http, $q, SituationService) {
    return {
        simulate: function() {
            var situation = SituationService.restoreLocal();
            var deferred = $q.defer();
            var apiSituation = this.createApiCompatibleSituation(situation);
            var that = this;

            $http.post('/api/situations', apiSituation).then(function(result) {
                situation._id = result.data._id
                $http.get('/api/situations/' + result.data._id + '/simulation').then(function(droits) {
                    deferred.resolve({
                        situationId: result.data._id,
                        droits: that.createDroitsFromApiResult(droits.data)
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

        createDroitsFromApiResult: function(result) {
            var droits = [];
            this.droits.forEach(function(droit) {
                var value = result[droit.id];
                if (value) {
                    var insert = {description: droit};
                    if (_.isNumber(value)) {
                        insert.montant = value;
                    }
                    droits.push(insert);
                }
            });

            return droits;
        },

        droits: [
            {
                id: 'aspa',
                label: 'Allocation de Solidarité aux Personnes Âgées',
                shortLabel: 'ASPA',
                imgSrc: 'logo_caf.png'
            },
            {
                id: 'acs',
                label: 'Aide pour une Complémentaire Santé',
                shortLabel: 'ACS',
                imgSrc: 'logo_caf.png'
            },
            {
                id: 'cmu_c',
                hasMontant: false,
                label: 'Couverture Maladie Universelle Complémentaire',
                shortLabel: 'CMU-C',
                imgSrc: 'logo_cmu.png'
            },
            {
                id: 'apl',
                label: 'Aide Personnalisée au Logement',
                shortLabel: 'APL',
                imgSrc: 'logo_caf.png'
            },
            {
                id: 'als',
                label: 'Allocation de Logement Social',
                shortLabel: 'ALS',
                imgSrc: 'logo_caf.png'
            },
            {
                id: 'alf',
                label: 'Allocation de Logement Familial',
                shortLabel: 'ALF',
                imgSrc: 'logo_caf.png'
            },
            {
                id: 'af',
                label: 'Allocations Familiales',
                shortLabel: 'AF',
                imgSrc: 'logo_caf.png'
            },
            {
                id: 'rsa',
                label: 'Revenu de Solidarité Active',
                shortLabel: 'RSA',
                imgSrc: 'logo_caf.png'
            }
        ]
    };
});

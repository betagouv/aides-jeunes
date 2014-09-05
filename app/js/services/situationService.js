'use strict';

angular.module('ddsApp').factory('SituationService', function($http, $sessionStorage, $filter, statutsSpecifiques) {
    var situation;

    return {
        nationaliteLabels: {
            fr: 'française',
            ue: 'UE',
            autre: 'hors UE'
        },

        relationTypeLabels: {
            'mariage': 'marié(e)',
            'pacs': 'pacsé(e)',
            'relation_libre': 'en relation libre'
        },

        find: function(situationId) {
            return $http.get('/api/situations/' + situationId).then(function(result) {
                var situation = result.data;
                situation.demandeur = _.find(situation.individus, { role: 'demandeur' });
                var conjoint = _.find(situation.individus, { role: 'conjoint' });
                if (conjoint) {
                    situation.conjoint = conjoint;
                }

                situation.enfants = _.where(situation.individus, { role: 'enfant' });
                situation.personnesACharge = _.where(situation.individus, { role: 'personneACharge'});

                return situation;
            });
        },

        newSituation: function() {
            situation = {};
            $sessionStorage.situation = situation;
        },

        restoreLocal: function() {
            if (!situation) {
                situation = $sessionStorage.situation || {};
            }

            return situation;
        },

        createIndividusList: function(situation) {
            var individus = [situation.demandeur];

            if (situation.conjoint) {
                individus.push(situation.conjoint);
            }

            individus = individus.concat(situation.enfants).concat(situation.personnesACharge);

            return individus;
        },

        individuLabel: function(individu) {
            if ('demandeur' === individu.role) {
                return 'Vous';
            }

            if ('conjoint' === individu.role) {
                return 'Votre conjoint';
            }

            return individu.firstName;
        },

        formatStatutsSpecifiques: function(individu) {
            var statuses = [];
            statutsSpecifiques.forEach(function(statut) {
                if (individu[statut.id]) {
                    statuses.push(statut.label);
                }
            });

            statuses = statuses.join(', ');
            statuses = $filter('uppercaseFirst')(statuses);

            return statuses;
        },

        getMonths: function() {
            // FIXME prendre la date du serveur
            return _.map([3, 2, 1], function(i) {
                var date = moment().subtract('months', i);
                return {
                    id: date.format('YYYY-MM'),
                    label: date.format('MMMM YYYY')
                };
            });
        },

        create: function(situation) {
            var apiSituation = this.createApiCompatibleSituation(situation);
            return $http.post('/api/situations', apiSituation).then(function(result) {
                return result.data;
            });
        },

        update: function(situation) {
            var apiSituation = this.createApiCompatibleSituation(situation);
            return $http.put('/api/situations/' + situation._id, apiSituation).then(function(result) {
                return result.data;
            });
        },

        createApiCompatibleSituation: function(situation) {
            var individus = [situation.demandeur];
            situation.demandeur.role = 'demandeur';
            if (situation.demandeur.dateSituationFamilialeString) {
                situation.demandeur.dateSituationFamiliale = moment(situation.demandeur.dateSituationFamilialeString, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }

            if (situation.conjoint) {
                individus.push(situation.conjoint);
                situation.conjoint.role = 'conjoint';
                situation.demandeur.statutMarital = situation.conjoint.relationType;
            } else {
                situation.demandeur.statutMarital = situation.demandeur.situationFamiliale;
            }

            situation.enfants.forEach(function(enfant) {
                enfant.role = 'enfant';
            });

            situation.personnesACharge.forEach(function(personne) {
                personne.role = 'personneACharge';
            });

            individus = individus.concat(situation.enfants).concat(situation.personnesACharge);
            individus = _.map(individus, this.createApiCompatibleIndividu);

            if (situation.logement.dateArriveeString) {
                situation.logement.dateArrivee = moment(situation.logement.dateArriveeString, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }

            var result = {
                individus: individus,
                logement: situation.logement,
                mobilierValue: situation.mobilierValue,
                immobilierValue: situation.immobilierValue,
                phoneNumber: situation.phoneNumber,
                email: situation.email
            };

            return result;
        },

        createApiCompatibleIndividu: function(individu) {
            individu = _.cloneDeep(individu);
            individu.dateDeNaissance = moment(individu.birthDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
            if (individu.dateArriveeFoyerString) {
                individu.dateArriveeFoyer = moment(individu.dateArriveeFoyerString, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }

            return individu;
        }
    };
});

'use strict';

angular.module('ddsApp').factory('SituationService', function($http, $sessionStorage, $filter, $q) {
    var situation, months;

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

        createIndividusList: function() {
            var individus = [
                {
                    name: 'Vous',
                    type: 'demandeur',
                    individu: situation.demandeur
                }
            ];

            if (situation.conjoint) {
                individus.push({
                    name: 'Votre conjoint',
                    type: 'conjoint',
                    individu: situation.conjoint
                });
            }

            _.forEach(situation.enfants, function(child) {
                individus.push({name: child.firstName, type: 'child', individu: child});
            });

            _.forEach(situation.personnesACharge, function(personne) {
                individus.push({name: personne.firstName, type: 'personneACharge', individu: personne});
            });

            return individus;
        },

        formatStatutsSpecifiques: function(individu) {
            var statuses = [];
            _.forEach(this.statutsSpecifiquesLabels, function(statut, statutId) {
                if (individu[statutId]) {
                    statuses.push(statut);
                }
            });

            statuses = statuses.join(', ');
            statuses = $filter('uppercaseFirst')(statuses);

            return statuses;
        },

        statutsSpecifiquesLabels: {
            'boursierEnseignementSup': 'boursier enseignement supérieur',
            'etudiant': 'étudiant',
            'demandeurEmploi': 'demandeur d\'emploi',
            'retraite': 'retraité'
        },

        getMonths: function() {
            if (months) {
                return months;
            }

            // FIXME prendre la date du serveur
            return _.map([3, 2, 1], function(i) {
                var date = moment().subtract('months', i);
                return {
                    id: date.format('YYYY-MM'),
                    label: date.format('MMMM YYYY')
                };
            });
        },

        simulate: function() {
            this.restoreLocal();
            var deferred = $q.defer();
            var apiSituation = this.createApiCompatibleSituation();
            console.log(apiSituation);

            $http.post('/api/situations', apiSituation).then(function(result) {
                $http.get('/api/situations/' + result.data._id + '/simulation').then(function(result) {
                    deferred.resolve(result.data);
                }, function() {
                    deferred.reject();
                });
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        },

        createApiCompatibleSituation: function() {
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

        logementTypes: [
            {
                label: 'locataire',
                value: 'locataire'
            },
            {
                label: 'propriétaire',
                value: 'proprietaire'
            },
            {
                label: 'occupant à titre gratuit',
                value: 'gratuit'
            }
        ],

        revenusSections: [
            {
                name: 'revenusActivite',
                label: 'Revenus d\'activité',
                subsections: [
                    {
                        name: 'revenusSalarie',
                        label: 'Salaires'
                    }, {
                        name: 'revenusNonSalarie',
                        label: 'Revenus non salariés'
                    }, {
                        name: 'revenusAutoEntrepreneur',
                        label: 'Revenus auto-entrepreneur'
                    },
                ]
            },
            {
                name: 'allocations',
                label: 'Allocations',
                subsections: [
                    {
                        name: 'allocationsChomage',
                        label: 'Allocation chômage'
                    }, {
                        name: 'allocationLogement',
                        label: 'Allocation logement'
                    }, {
                        name: 'rsa',
                        label: 'Revenu de solidarité active (RSA)'
                    }, {
                        name: 'aspa',
                        label: 'Allocation de solidarité aux personnes âgées (ASPA)'
                    }, {
                        name: 'ass',
                        label: 'Allocation de solidarité spécifique (ASS)'
                    }
                ]
            },
            {
                name: 'indemnites',
                label: 'Indemnités',
                subsections: [
                    {
                        name: 'indJourMaternite',
                        label: 'Indemnités de maternité'
                    }, {
                        name: 'indJourPaternite',
                        label: 'Indemnités de paternité'
                    }, {
                        name: 'indJourAdoption',
                        label: 'Indemnités d\'adoption'
                    }, {
                        name: 'indJourMaladie',
                        label: 'Indemnités maladie'
                    }, {
                        name: 'indJourMaladieProf',
                        label: 'Indemnités maladie professionnelle'
                    }, {
                        name: 'indJourAccidentDuTravail',
                        label: 'Indemnités accident du travail'
                    }, {
                        name: 'indChomagePartiel',
                        label: 'Indemnités de chômage partiel'
                    }
                ]
            },
            {
                name: 'pensions',
                label: 'Pensions',
                subsections: [
                    {
                        name: 'pensionsAlimentaires',
                        label: 'Pensions alimentaires'
                    }, {
                        name: 'pensionsRetraitesRentes',
                        label: 'Retraites, rentes'
                    }
                ]
            }
        ]
    };
});

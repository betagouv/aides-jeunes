'use strict';

angular.module('ddsApp').factory('SituationService', function($http, $sessionStorage, $filter) {
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
                return result.data;
            });
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
            if (situation.conjoint) {
                individus.push(situation.conjoint);
                situation.conjoint.role = 'conjoint';
                situation.demandeur.statusMarital = situation.conjoint.relationType;
            } else {
                situation.demandeur.statusMarital = 'celibat';
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
                logement: situation.logement,
                phoneNumber: situation.phoneNumber,
                email: situation.email
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
                    }, {
                        name: 'revenusStage',
                        label: 'Rémunération de stage'
                    }
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
                        label: 'Aide au logement'
                    }, {
                        name: 'rsa',
                        label: 'Revenu de solidarité active (RSA)'
                    }, {
                        name: 'aspa',
                        label: 'Allocation de solidarité aux personnes âgées (ASPA)'
                    }, {
                        name: 'ass',
                        label: 'Allocation de solidarité spécifique (ASS)'
                    }, {
                        name: 'aah',
                        label: 'Allocation adulte handicapé'
                    }
                ]
            },
            {
                name: 'indemnites',
                label: 'Indemnités',
                subsections: [
                    {
                        name: 'indJourMaternite',
                        label: 'Indemnités de maternité, paternité, adoption'
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
                        label: 'Retraites (y compris reversion), rentes'
                    }, {
                        name: 'pensionsInvalidite',
                        label: 'Pensions d\'invalidité'
                    }
                ]
            },
            {
                name: 'autre',
                label: 'Autres',
                subsections: [
                    {
                        name: 'bourseEnseignementSup',
                        label: 'Bourses de l\'enseignement supérieur'
                    }
                ]
            }
        ]
    };
});

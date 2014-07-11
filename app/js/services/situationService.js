'use strict';

angular.module('ddsApp').factory('SituationService', function($http, $sessionStorage, $filter) {
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
            for (var i in this.statutsSpecifiquesLabels) {
                if (individu[i]) {
                    statuses.push(this.statutsSpecifiquesLabels[i]);
                }
            }

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

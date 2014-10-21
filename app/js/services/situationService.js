'use strict';

angular.module('ddsApp').factory('SituationService', function($http, $sessionStorage) {
    var situation;

    var flattenIndividuRessources = function(individu) {
        var ressources = individu.ressources || [];
        individu.ressources = [];
        ressources.forEach(function(ressource) {
            if (ressource.periode) {
                individu.ressources.push(ressource);
            } else {
                var debutPeriode = moment(ressource.debutPeriode, 'YYYY-MM');
                var finPeriode = moment(ressource.finPeriode, 'YYYY-MM');
                var monthsDiff = finPeriode.diff(debutPeriode, 'months') + 1;
                var totalMontantToFlatten = ressource.montant;
                _.where(ressources, {type: ressource.type}).forEach(function(diffRessource) {
                    var periode = diffRessource.periode;
                    if (periode) {
                        periode = moment(periode, 'YYYY-MM');
                        if ((periode.isAfter(debutPeriode) || periode.isSame(debutPeriode))
                            && (periode.isBefore(finPeriode) || periode.isSame(finPeriode))) {
                            totalMontantToFlatten -= diffRessource.montant;
                            monthsDiff--;
                        }
                    }
                });

                var flattenedMontant = Math.round(totalMontantToFlatten / monthsDiff);

                while (debutPeriode.isBefore(finPeriode) || debutPeriode.isSame(finPeriode)) {
                    if (!_.find(ressources, {periode: debutPeriode.format('YYYY-MM')})) {
                        individu.ressources.push({
                            periode: debutPeriode.format('YYYY-MM'),
                            type: ressource.type,
                            montant: flattenedMontant
                        });
                    }
                    debutPeriode.add(1, 'months');
                }
            }
        });
    };

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

        restoreRemote: function(situationId) {
            return $http.get('/api/situations/' + situationId).then(function(result) {
                situation = result.data;
                situation.demandeur = _.find(situation.individus, { role: 'demandeur' });
                var conjoint = _.find(situation.individus, { role: 'conjoint' });
                if (conjoint) {
                    situation.conjoint = conjoint;
                }

                situation.enfants = _.where(situation.individus, { role: 'enfant' });
                situation.personnesACharge = _.where(situation.individus, { role: 'personneACharge'});

                situation.individus.forEach(function(individu) {
                    individu.dateDeNaissance = moment(individu.dateDeNaissance).format('DD/MM/YYYY');
                });

                return situation;
            });
        },

        createIndividusList: function(situation) {
            var individus = [situation.demandeur];

            if (situation.conjoint) {
                individus.push(situation.conjoint);
            }

            individus = individus.concat(situation.enfants).concat(situation.personnesACharge);

            return individus;
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
            var demandeur = situation.demandeur;
            var individus = [demandeur];
            demandeur.role = 'demandeur';
            if (demandeur.dateSituationFamilialeString) {
                demandeur.dateSituationFamiliale = moment(demandeur.dateSituationFamilialeString, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }

            if (situation.conjoint) {
                individus.push(situation.conjoint);
                situation.conjoint.role = 'conjoint';
                demandeur.statutMarital = situation.conjoint.relationType;
            } else {
                demandeur.statutMarital = demandeur.situationFamiliale;
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
                patrimoine: situation.patrimoine,
                phoneNumber: situation.phoneNumber,
                email: situation.email
            };

            return result;
        },

        createApiCompatibleIndividu: function(individu) {
            individu = _.cloneDeep(individu);
            individu.dateDeNaissance = moment(individu.dateDeNaissance, 'DD/MM/YYYY').format('YYYY-MM-DD');
            if (individu.dateArriveeFoyerString) {
                individu.dateArriveeFoyer = moment(individu.dateArriveeFoyerString, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }
            flattenIndividuRessources(individu);

            return individu;
        },

        flattenIndividuRessources: flattenIndividuRessources
    };
});

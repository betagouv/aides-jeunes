'use strict';

angular.module('ddsCommon').service('IndividuService', function($filter, specificSituations, nationalites) {
    function isRoleParent (role) {
        return _.contains(['demandeur', 'conjoint'], role);
    }

    return {
        age: function(individu) {
            // FIXME Il faudrait retourner l'âge par rapport à la date de valeur de la situation
            return moment().diff(individu.dateDeNaissance, 'years');
        },

        label: function(individu) {
            if ('demandeur' === individu.role) {
                return 'Vous';
            }

            if ('conjoint' === individu.role) {
                return 'Votre conjoint';
            }

            return individu.firstName;
        },

        ressourceHeader: function(individu) {
            switch (individu.role) {
                case 'demandeur':
                    return 'Vos ressources';
                case 'conjoint':
                    return 'Les ressources de votre conjoint';
                default:
                    return 'Les ressources de ' + individu.firstName;
            }
        },

        nationaliteLabel: function(individu) {
            return _.find(nationalites, { id: individu.nationalite }).label;
        },

        isRoleParent: isRoleParent,

        isParent: function(individu) {
            return isRoleParent(individu.role);
        },

        formatStatutsSpecifiques: function(individu) {
            var statuts = [];
            specificSituations.forEach(function(statut) {
                if (_.find(individu.specificSituations, {situation: statut.id})) {
                    statuts.push(statut.label);
                }
            });

            if (individu.enceinte) {
                statuts.push('enceinte');
            }

            if (individu.boursier) {
                statuts.push('boursier');
            }

            if (individu.gardeAlternee) {
                statuts.push('en garde alternée');
            }

            statuts = _.map(statuts, $filter('lowercaseFirst'));
            statuts = statuts.join(', ');
            statuts = $filter('uppercaseFirst')(statuts);

            return statuts;
        }
    };
});

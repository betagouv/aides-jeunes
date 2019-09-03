'use strict';

angular.module('ddsCommon').service('IndividuService', function($filter, specificSituations, NationaliteService) {
    function isRoleParent (role) {
        return _.includes(['demandeur', 'conjoint'], role);
    }

    function ressourceHeader(individu) {
        switch (individu.role) {
        case 'demandeur':
            return 'Vos ressources personnelles uniquement';
        case 'conjoint':
            return 'Les ressources de votre conjoint·e';
        default:
            return 'Les ressources de ' + individu.firstName;
        }
    }

    return {
        age: function(individu, dateDeReference) {
            return moment(dateDeReference).diff(individu.date_naissance, 'years');
        },

        label: function(individu) {
            if ('demandeur' === individu.role) {
                return 'Vous';
            }

            if ('conjoint' === individu.role) {
                return 'Votre conjoint·e';
            }

            return individu.firstName;
        },

        ressourceHeader: ressourceHeader,

        ressourceShortLabel: function(individu) {
            switch (individu.role) {
            case 'demandeur':
                return 'Vos ressources';
            default:
                return ressourceHeader(individu);
            }
        },

        nationaliteLabel: function(individu) {
            return NationaliteService.getLabel(individu.nationalite);
        },

        isRoleParent: isRoleParent,

        isParent: function(individu) {
            return isRoleParent(individu.role);
        },

        formatStatutsSpecifiques: function(individu) {
            var statuts = [];
            specificSituations.forEach(function(statut) {
                if (individu.specificSituations && individu.specificSituations.indexOf(statut.id) >= 0) {
                    statuts.push(statut.label);
                }
            });

            if (individu.enceinte) {
                statuts.push('enceinte');
            }

            if (individu.boursier) {
                statuts.push('boursier');
            }

            if (individu.garde_alternee) {
                statuts.push('en garde alternée');
            }

            statuts = _.map(statuts, $filter('lowercaseFirst'));
            statuts = statuts.join(', ');
            statuts = $filter('uppercaseFirst')(statuts);

            return statuts;
        }
    };
});

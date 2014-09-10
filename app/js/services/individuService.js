'use strict';

angular.module('ddsApp').factory('IndividuService', function($filter, statutsSpecifiques) {
    return {
        age: function(individu) {
            var dateNaissance = moment(individu.dateDeNaissance, 'DD/MM/YYYY');
            return moment().diff(dateNaissance, 'years');
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
        }
    };
});

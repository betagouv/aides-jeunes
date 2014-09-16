'use strict';

angular.module('ddsApp').factory('IndividuService', function($filter, situationsPro) {
    var statutsSpecifiques = _.filter(situationsPro, 'isStatutSpecifique');

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

        getStatutsSpecifiques: function() {
            return statutsSpecifiques;
        },

        formatStatutsSpecifiques: function(individu) {
            var statuts = [];
            statutsSpecifiques.forEach(function(statut) {
                if (_.find(individu.situationsPro, {situation: statut.id})) {
                    statuts.push(statut.label);
                }
            });

            statuts = _.map(statuts, $filter('lowercaseFirst'));
            statuts = statuts.join(', ');
            statuts = $filter('uppercaseFirst')(statuts);

            return statuts;
        }
    };
});

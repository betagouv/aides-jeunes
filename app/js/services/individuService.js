'use strict';

angular.module('ddsCommon').service('IndividuService', function($filter, situationsPro, nationalites) {
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

        nationaliteLabel: function(individu) {
            return _.find(nationalites, {id: individu.nationalite}).label;
        },

        getStatutsSpecifiques: function() {
            return statutsSpecifiques;
        },

        isRoleParent: function(role) {
            return _.contains(['demandeur', 'conjoint'], role);
        },

        isParent: function(individu) {
            return this.isRoleParent(individu.role);
        },

        formatStatutsSpecifiques: function(individu) {
            var statuts = [];
            statutsSpecifiques.forEach(function(statut) {
                if (_.find(individu.situationsPro, {situation: statut.id})) {
                    statuts.push(statut.label);
                }
            });

            if (individu.enceinte) {
                statuts.push('enceinte');
            }

            statuts = _.map(statuts, $filter('lowercaseFirst'));
            statuts = statuts.join(', ');
            statuts = $filter('uppercaseFirst')(statuts);

            return statuts;
        }
    };
});

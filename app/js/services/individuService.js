'use strict';

angular.module('ddsApp').factory('IndividuService', function() {
    return {
        age: function(individu) {
            var dateNaissance = moment(individu.birthDate, 'DD/MM/YYYY');
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
        }
    };
});

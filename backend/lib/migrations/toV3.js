/*
 * Use OpenFisca France new naming convention for activite enumerations
 */

var specificSituations = {
    demandeur_emploi: 'chomeur',
};

module.exports = {
    function: function(situation) {
        situation.version = 3;

        situation.individus.forEach(function(individu) {
            individu.specificSituations = individu.specificSituations.map(function(situation) {
                return specificSituations[situation] || situation;
            });
        });

        return situation;
    },
    version: 3
};

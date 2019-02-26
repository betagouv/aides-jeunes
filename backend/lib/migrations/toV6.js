/*
 * Add default value for menage.aide_logement_date_pret_conventionne
 */

var VERSION = 6;

module.exports = {
    function: function(situation) {
        if (!situation.menage.aide_logement_date_pret_conventionne) {
            situation.menage.aide_logement_date_pret_conventionne = '2017-12-31';
        }

        return situation;
    },
    version: VERSION
};

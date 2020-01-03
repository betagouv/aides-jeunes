/*
 * Store nationalite_code (for example FR)
 */

var VERSION = 10;

module.exports = {
    function: function(situation) {

        situation.get('individus').forEach(function(individu) {
            if (individu.nationalite) {
                switch (individu.nationalite) {
                case 'ue':
                    individu.nationalite_code = 'DE';
                    break;
                case 'autre':
                    individu.nationalite_code = 'AF';
                    break;
                default:
                    individu.nationalite_code = 'FR';
                }
            }
        });

        return situation;
    },
    version: VERSION
};

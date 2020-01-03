/*
 * Rename nationalite_code to nationalite
 */

var VERSION = 11;

module.exports = {
    function: function(situation) {

        situation.get('individus').forEach(function(individu) {

            var nationaliteCode = individu.nationalite_code;

            if (nationaliteCode) {
                individu.nationalite = nationaliteCode.toUpperCase();
            } else {
                switch (individu.nationalite) {
                case 'ue':
                    individu.nationalite = 'DE';
                    break;
                case 'autre':
                    individu.nationalite = 'AF';
                    break;
                default:
                    individu.nationalite = 'FR';
                }
            }
        });

        return situation;
    },
    version: VERSION
};

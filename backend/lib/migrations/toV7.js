/*
 * Proxy date_debut_chomage with existing data
 */

var VERSION = 7;

module.exports = {
    function: function(situation) {
        situation.get('individus').forEach(function(individu) {
            var dateDernierContratTravail = individu.dateDernierContratTravail;
            // includes null
            if (dateDernierContratTravail !== undefined) {
                // excludes null
                if (dateDernierContratTravail) {
                    individu.date_debut_chomage = dateDernierContratTravail;
                }
                individu.set('dateDernierContratTravail', undefined, { strict: false });
            } else {
                var chomage_net = individu.chomage_net;
                if (chomage_net) {
                    var keys = Object.keys(chomage_net);
                    keys.sort().reverse();
                    var month = keys.reduce(function(value, currentPeriod) {
                        return value || ((! chomage_net[currentPeriod]) && currentPeriod);
                    }, false);

                    var period = month ? month : (keys.length && keys[keys.length-1]);
                    if (period) {
                        individu.date_debut_chomage = month + '-01';
                    }

                }
            }
        });

        return situation;
    },
    version: VERSION
};

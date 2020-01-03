/*
 * Move ASI and ASS to individuals
 */

var VERSION = 5;

var variables = ['asi', 'ass'];
module.exports = {
    function: function(situation) {
        var individus = situation.get('individus');
        if (!individus || !individus.length) {
            return situation;
        }
        var destination = individus[0];
        variables.forEach(function(variable) {
            var value = situation.famille.get(variable);
            if (value) {
                destination.set(variable, value);
                situation.famille.set(variable, undefined, { strict: false });
            }
        });

        return situation;
    },
    version: VERSION
};

/*
 * Rename nationalite_code to nationalite
 */

var VERSION = 13

module.exports = {
    function: function(situation) {
        var individus = situation.get('individus')
        situation.demandeur = individus[0]

        if (individus[individus.length - 1].role === 'conjoint') {
            situation.conjoint = individus[individus.length - 1]
            situation.enfants = individus.slice(1, individus.length - 2)
        } else {
            situation.enfants = individus.slice(1, individus.length - 1)
        }

        return situation
    },
    version: VERSION
}

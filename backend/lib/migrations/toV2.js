/*
 * Rename echelon_bourse in bourse_criteres_sociaux_echelon
 */
var _ = require('lodash')

var VERSION = 2

function updatePerson(p) {
    p.bourse_criteres_sociaux_echelon = p.echelon_bourse

    return _.omit(p, 'echelon_bourse')
}

module.exports = {
    function: function(situation) {

        situation.demandeur = updatePerson(situation.demandeur)
        situation.conjoint = updatePerson(situation.conjoint)

        situation.enfants = situation.enfants.map(e => {
            return updatePerson(e)
        })

        return situation
    },
    version: VERSION
}

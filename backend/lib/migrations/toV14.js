/*
 * Remove specific_situations
 */
var _ = require('lodash')

var VERSION = 14

var specificSituationValues = [
    'chomeur', // Not passed to OpenFisca / Front only
    'etudiant',
    'retraite', // Not passed to OpenFisca / Front only
    'handicap',
    'inapte_travail'
];

function updatePerson(p) {
    if (!p) {
        return p
    }

    const s = p.specific_situations || (p.get && p.get('specific_situations')) || []
    specificSituationValues.forEach(id => {
        p[id] = s.indexOf(id) >= 0
    })
    return _.omit(p, 'specificSituations')
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

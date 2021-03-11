/*
 * Prefix front only attribute with _
 */
var _ = require('lodash')

var VERSION = 15

function updatePerson(p) {
    if (!p) {
        return p
    }

    const props = [
        'chomeur',
        'firstName',
        'hasRessources',
        'retraite',
        'role',
    ]

    props.forEach(id => {
        p['_' + id] = p[id] || (p.get && p.get(id))
    })
    return _.omit(p, ...props)
}

module.exports = {
    function: function(situation) {

        situation.demandeur = updatePerson(situation.demandeur)
        situation.conjoint = updatePerson(situation.conjoint)

        situation.enfants = situation.enfants.map(e => {
            return updatePerson(e)
        })

        situation.menage._nomCommune = situation.menage.nom_commune
        situation.menage._codePostal = situation.menage.code_postal
        situation.menage = _.omit(situation.menage, 'code_postal', 'nom_commune')

        return situation
    },
    version: VERSION
}

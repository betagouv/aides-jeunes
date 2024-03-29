/*
 * Rename echelon_bourse in bourse_criteres_sociaux_echelon
 */
import _ from "lodash-es"

const VERSION = 2

function updatePerson(p) {
  if (!p) {
    return
  }
  p.bourse_criteres_sociaux_echelon = p.echelon_bourse

  return _.omit(p, "echelon_bourse")
}

export default {
  apply(situation) {
    situation.demandeur = updatePerson(situation.demandeur)
    situation.conjoint = updatePerson(situation.conjoint)

    situation.enfants = situation.enfants.map((e) => {
      return updatePerson(e)
    })

    return situation
  },
  version: VERSION,
}

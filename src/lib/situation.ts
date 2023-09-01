import dayjs from "dayjs"
import { Situation } from "@lib/types/situations.js"
import { Enfant } from "@lib/types/enfant.js"
import { Individu } from "@lib/types/individu.js"

const SituationMethods = {
  getDemandeur: function (situation: Situation) {
    return situation.demandeur
  },

  getConjoint: function (situation: Situation) {
    return situation.conjoint
  },

  getEnfants: function (situation: Situation) {
    return situation.enfants
  },

  aCharge: function (situation: Situation) {
    const demandeur = situation.demandeur
    const period =
      situation.dateDeValeur && dayjs(situation.dateDeValeur).format("YYYY")
    return demandeur?.enfant_a_charge?.[period]
  },

  hasEnfantScolarise: function (situation: Situation) {
    return (
      situation.enfants.some((enfant) => enfant.scolarite === "college") ||
      situation.enfants.some((enfant) => enfant.scolarite === "lycee")
    )
  },

  setEnfants: function (situation, enfants: Enfant) {
    let individus: Individu[] = situation.individus
    individus = individus.filter(function (individu) {
      return "enfant" !== individu._role
    })
    individus = individus.slice(0, 1).concat(enfants).concat(individus.slice(1))
    situation.individus = individus
    return enfants
  },
}

export default SituationMethods

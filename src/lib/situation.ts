import dayjs from "dayjs"
import { situationsLayout } from "@lib/types/situations.js"
import { enfantLayout } from "@lib/types/enfant.js"
import { individuLayout } from "@lib/types/individu.js"

const Situation = {
  getDemandeur: function (situation: situationsLayout) {
    return situation.demandeur
  },

  getConjoint: function (situation: situationsLayout) {
    return situation.conjoint
  },

  getEnfants: function (situation: situationsLayout) {
    return situation.enfants
  },

  aCharge: function (situation: situationsLayout) {
    const demandeur = situation.demandeur
    const period =
      situation.dateDeValeur && dayjs(situation.dateDeValeur).format("YYYY")
    return demandeur?.enfant_a_charge?.[period]
  },

  hasEnfantScolarise: function (situation: situationsLayout) {
    return (
      situation.enfants.some((enfant) => enfant.scolarite === "college") ||
      situation.enfants.some((enfant) => enfant.scolarite === "lycee")
    )
  },

  setEnfants: function (situation, enfants: enfantLayout) {
    let individus: individuLayout[] = situation.individus
    individus = individus.filter(function (individu) {
      return "enfant" !== individu._role
    })
    individus = individus.slice(0, 1).concat(enfants).concat(individus.slice(1))
    situation.individus = individus
    return enfants
  },
}

export default Situation

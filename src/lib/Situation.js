import moment from "moment"

const Situation = {
  getDemandeur: function (situation) {
    return situation.demandeur
  },

  getConjoint: function (situation) {
    return situation.conjoint
  },

  getEnfants: function (situation) {
    return situation.enfants
  },

  aCharge: function (situation) {
    let demandeur = situation.demandeur
    let period =
      situation.dateDeValeur && moment(situation.dateDeValeur).format("YYYY")
    return demandeur.enfant_a_charge && demandeur.enfant_a_charge[period]
  },

  hasEnfantScolarise: function (situation) {
    return (
      situation.enfants.some((enfant) => enfant.scolarite === "college") ||
      situation.enfants.some((enfant) => enfant.scolarite === "lycee")
    )
  },

  setEnfants: function (situation, enfants) {
    let individus = situation.individus
    individus = individus.filter(function (individu) {
      return "enfant" !== individu._role
    })
    individus = individus.slice(0, 1).concat(enfants).concat(individus.slice(1))
    situation.individus = individus
    return enfants
  },
}

export default Situation

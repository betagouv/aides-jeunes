import dayjs from "dayjs"
import { Situation } from "@lib/types/situations.js"
import { Individu } from "@lib/types/individu.js"

function getDemandeur(situation: Situation) {
  return situation.demandeur
}

function getConjoint(situation: Situation) {
  return situation.conjoint
}

function getEnfants(situation: Situation) {
  return situation.enfants
}

function aCharge(situation: Situation) {
  const demandeur = situation.demandeur
  const period =
    situation.dateDeValeur && dayjs(situation.dateDeValeur).format("YYYY")
  return demandeur?.enfant_a_charge?.[period]
}

function getIndividusSortedParentsFirst(situation: Situation): Individu[] {
  return ([] as any[])
    .concat(
      getDemandeur(situation),
      getConjoint(situation),
      getEnfants(situation)
    )
    .filter(function (individu) {
      return individu
    })
}

export default {
  getDemandeur,
  getConjoint,
  getEnfants,
  aCharge,
  getIndividusSortedParentsFirst,
}

/*
 * Migre rpns_auto_entrepreneur vers rpns_micro_entreprise
 */

import _ from "lodash-es"

const VERSION = 11

const AE_map = {
  rpns_auto_entrepreneur_CA_achat_revente:
    "rpns_micro_entreprise_CA_bic_vente_imp",
  rpns_auto_entrepreneur_CA_bic: "rpns_micro_entreprise_CA_bic_service_imp",
  rpns_auto_entrepreneur_CA_bnc: "rpns_micro_entreprise_CA_bnc_imp",
}

function replaceAutoEntrepreneurInRessources(answers) {
  const ressourcesList = answers.filter(
    (answer) =>
      answer.entityName === "individu" && answer.fieldName === "ressources"
  )

  ressourcesList.forEach((ressources) => {
    let update = false

    const newRessourcesValue = ressources.value.map((ressource) => {
      if (AE_map[ressource]) {
        update = true
        return AE_map[ressource]
      }
      return ressource
    })

    if (update) {
      ressources.set("value", newRessourcesValue, { strict: false })
    }
  })
}

function replaceAutoEntrepeneurInRpnsRessources(answers) {
  const rnpsRessourcesList = answers.filter(
    (answer) => answer.entityName === "individu" && answer.fieldName === "rpns"
  )

  rnpsRessourcesList.forEach((rnpsRessources) => {
    let update = false
    const newRessources = rnpsRessources.value.map((ressource) => {
      const result = { ...ressource }
      if (AE_map[ressource.id]) {
        result.id = AE_map[ressource.id]
        update = true
        // Dans certains cas il n'y a pas `amounts`
        if (!result.amounts) {
          result.amounts = {}
          return result
        }

        // Récupères le montant des 4 derniers mois et fait la moyenne des résultats pour calculer le revenu annuel
        const year = Object.keys(result.amounts).find(
          (key) => key.length === 4
        )!
        const amountsByMonthKey = Object.keys(result.amounts).filter(
          (key) => key.length === 7
        )
        const amountsByMonthKeyToSum = amountsByMonthKey.filter(
          (key) => !key.startsWith(year)
        )
        const newYear = amountsByMonthKeyToSum[0].slice(0, 4)
        result.amounts[newYear] =
          (amountsByMonthKeyToSum.reduce(
            (accum, key) => accum + result.amounts[key],
            0
          ) /
            (amountsByMonthKeyToSum.length || 1)) *
          12

        result.amounts = _.omit(result.amounts, amountsByMonthKey)
      }
      return result
    })

    if (update) {
      rnpsRessources.set("value", newRessources, {
        strict: false,
      })
    }
  })
}

function updateAutoEntrepreneur(answers) {
  replaceAutoEntrepreneurInRessources(answers)
  replaceAutoEntrepeneurInRpnsRessources(answers)
}

export default {
  apply(simulation) {
    updateAutoEntrepreneur(simulation.answers.all)
    updateAutoEntrepreneur(simulation.answers.current)
    return simulation
  },
  version: VERSION,
}

/*
 * Migre rpns_auto_entrepreneur vers rpns_micro_entreprise
 */

const VERSION = 11

const AE_map = {
  rpns_auto_entrepreneur_CA_achat_revente:
    "rpns_micro_entreprise_CA_bic_vente_imp",
  rpns_auto_entrepreneur_CA_bic: "rpns_micro_entreprise_CA_bic_service_imp",
  rpns_auto_entrepreneur_CA_bnc: "rpns_micro_entreprise_CA_bnc_imp",
}

function replaceAutoEntrepreneurInRessources(answers) {
  const ressources = answers.find(
    (answer) =>
      answer.entityName === "individu" && answer.fieldName === "ressources"
  )

  if (!ressources) return

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
}

function replaceAutoEntrepeneurInRpnsRessources(answers) {
  const rnpsRessources = answers.find(
    (answer) => answer.entityName === "individu" && answer.fieldName === "rpns"
  )

  if (!rnpsRessources) return

  let update = false
  const newRessources = rnpsRessources.value.map((ressource) => {
    if (AE_map[ressource.id]) {
      ressource.id = AE_map[ressource.id]
      update = true
    }
    return ressource
  })

  if (update) {
    rnpsRessources.set("value", newRessources, {
      strict: false,
    })
  }
}

function updateAutoEntrepreneur(answers) {
  replaceAutoEntrepreneurInRessources(answers)
  replaceAutoEntrepeneurInRpnsRessources(answers)
}

module.exports = {
  function: function (simulation) {
    updateAutoEntrepreneur(simulation.answers.all)
    updateAutoEntrepreneur(simulation.answers.current)
    return simulation
  },
  version: VERSION,
}

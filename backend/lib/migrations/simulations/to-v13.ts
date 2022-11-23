const VERSION = 13

// WORK IN PROGRESS

// Migre le champ statut_occupation_logement
// en _logementType, _locationType et _primoAccedant
const getPrimoAccedant = (statut_occupation_logement) => {
  return statut_occupation_logement === "primo_accedant"
}

const getLogementType = (statut_occupation_logement) => {
  const logementTypeMap: any = {
    locataire_foyer: "locataire",
    locataire_meuble: "locataire",
    locataire_vide: "locataire",
    loge_gratuitement: "heberge",
    primo_accedant: "proprietaire",
    proprietaire: "proprietaire",
    sans_domicile: "sansDomicile",
  }
  return logementTypeMap[statut_occupation_logement]
}

const getLocationType = (statut_occupation_logement) => {
  const locationTypeMap: any = {
    locataire_foyer: "foyer",
    locataire_meuble: "meublehotel",
    locataire_vide: "nonmeuble",
    loge_gratuitement: null,
    primo_accedant: null,
    proprietaire: null,
    sans_domicile: null,
  }
  return locationTypeMap[statut_occupation_logement]
}

const updateStatutOccupationLogement = (answers) => {
  const answerIndex = answers.findIndex(
    (answer) =>
      answer.id === "menage" &&
      answer.fieldName === "statut_occupation_logement"
  )

  if (answerIndex < 0) return

  const statut_occupation_logement = answers[answerIndex].value

  answers[answerIndex].fieldName = "_logementType"
  const logementType = getLogementType(statut_occupation_logement)

  if (answers[answerIndex].value) {
    answers[answerIndex].value = logementType
  }

  if (logementType === "proprietaire") {
    answers.splice(answerIndex + 1, 0, {
      id: "menage",
      fieldName: "_primoAccedant",
      value: getPrimoAccedant(statut_occupation_logement),
    })
  }
  if (logementType === "locataire") {
    const locationType = getLocationType(statut_occupation_logement)
    answers.splice(answerIndex + 1, 0, {
      id: "menage",
      fieldName: "_locationType",
      value: locationType,
    })
  }
}

export default {
  apply(simulation) {
    updateStatutOccupationLogement(simulation.answers.all)
    updateStatutOccupationLogement(simulation.answers.current)
    return simulation
  },
  version: VERSION,
}

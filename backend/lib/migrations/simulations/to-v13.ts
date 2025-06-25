const VERSION = 13

// Migre le champ statut_occupation_logement
// en _logementType, _locationType et _primoAccedant

const logementTypeMap: any = {
  locataire_foyer: "locataire",
  locataire_meuble: "locataire",
  locataire_vide: "locataire",
  loge_gratuitement: "heberge",
  primo_accedant: "proprietaire",
  proprietaire: "proprietaire",
  sans_domicile: "sansDomicile",
}

const locationTypeMap: any = {
  locataire_foyer: "foyer",
  locataire_meuble: "meuble",
  locataire_vide: "vide",
}

const updateStatutOccupationLogement = (answers) => {
  const answerIndex = answers.findIndex(
    (answer) => answer.fieldName === "statut_occupation_logement",
  )

  if (answerIndex < 0) return

  const statut_occupation_logement = answers[answerIndex].value

  answers[answerIndex].fieldName = "_logementType"
  const logementType = logementTypeMap[statut_occupation_logement]

  if (answers[answerIndex].value) {
    answers[answerIndex].value = logementType
  }

  if (logementType === "proprietaire") {
    answers.splice(answerIndex + 1, 0, {
      entityName: "menage",
      fieldName: "_primoAccedant",
      value: statut_occupation_logement === "primo_accedant",
    })
  }
  if (logementType === "locataire") {
    const locationType = locationTypeMap[statut_occupation_logement]
    answers.splice(answerIndex + 1, 0, {
      entityName: "menage",
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

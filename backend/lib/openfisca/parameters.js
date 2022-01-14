const Sentry = require("@sentry/node")
const openfisca = require("./getter")

const parametersList = {
  "prestations_sociales.aides_jeunes.carte_des_metiers.age_maximal": 26,
  "prestations_sociales.prestations_etat_de_sante.invalidite.aah.taux_capacite.taux_incapacite": 0.8,
  "marche_travail.epargne.livret_a.taux": 0.005,
  "marche_travail.salaire_minimum.smic.smic_b_horaire": 10.57,
  "marche_travail.salaire_minimum.smic.nb_heures_travail_mensuel": 151.67,
}

let parameters

const computeParameters = async () => {
  if (!parameters) {
    const values = await Promise.all(
      Object.keys(parametersList).map((parameter) =>
        openfisca.getPromise(`/parameter/${parameter}`)
      )
    )

    let newParameters = {}
    values.forEach((value) => {
      newParameters[value.id] = value.values
    })
    parameters = newParameters
  }
}

const computeParameter = (parameter, date) => {
  const values = parameters?.[parameter]
  if (values) {
    const closestDate = Object.keys(values).find(
      (valueDate) => new Date(valueDate) < date
    )
    if (closestDate) {
      return values[closestDate]
    }
  }
  Sentry.captureMessage("Openfisca parameters are not loaded", (scope) => {
    scope.setContext("parameters", {
      date,
      parameter,
      parameters,
    })
  })
  return parametersList[parameter]
}

module.exports.parametersList = parametersList

module.exports.getParameter = (parameter, date) => {
  return computeParameter(parameter, date)
}

module.exports.getParameters = async (date) => {
  await computeParameters()

  const results = {}
  Object.keys(parametersList).forEach(async (parameter) => {
    results[parameter] = computeParameter(parameter, date)
  })

  return results
}

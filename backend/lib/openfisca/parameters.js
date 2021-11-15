const Sentry = require("@sentry/browser")
const openfisca = require("./getter")

const parametersList = {
  "prestations.carte_des_metiers.age_maximal": 26,
  "prestations.minima_sociaux.aah.taux_incapacite": 0.8,
  "epargne.livret_a.taux": 0.005,
  "marche_travail.salaire_minimum.smic_h_b": 10.48,
  "marche_travail.salaire_minimum.nb_heure_travail_mensuel": 151.67,
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
  const values = parameters && parameters[parameter]
  if (values) {
    const closestDate = Object.keys(values).find(
      (valueDate) => new Date(valueDate) < date
    )
    if (closestDate) {
      return values[closestDate]
    }
  }
  Sentry.captureMessage("Openfisca parameters are not loaded", (scope) => {
    scope.setTag("date", date)
    scope.setTag("parameters", parameters)
    scope.setTag("parameter", parameter)
  })
  return parametersList[parameter]
}

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

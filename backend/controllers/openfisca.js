var openfisca = require("../lib/openfisca")

const parametersList = {
  "prestations.carte_des_metiers.age_maximal": 26,
  "prestations.minima_sociaux.aah.taux_incapacite": 0.8,
  "epargne.livret_a.taux": 0.005,
}

let parameters

module.exports.getParameters = async (date) => {
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

  const results = {}
  Object.keys(parametersList).forEach((parameter) => {
    const values = parameters[parameter]
    if (values) {
      const closestDate = Object.keys(values).find(
        (valueDate) => new Date(valueDate) < date
      )
      if (closestDate) {
        results[parameter] = values[closestDate]
        return
      }
    }
    results[parameter] = parametersList[parameter]
  })

  return results
}

var openfisca = require("../lib/openfisca")

const parametersList = {
  "prestations.carte_des_metiers.age_maximal": 26,
}

let parameters = {}
let expirationDate

module.exports.getParameters = async (date) => {
  const now = new Date()
  if (!expirationDate || expirationDate < now) {
    const values = await Promise.all(
      Object.keys(parametersList).map((parameter) =>
        openfisca.getPromise(`/parameter/${parameter}`)
      )
    )

    values.forEach((value) => {
      parameters[value.id] = value.values
    })
    now.setDate(now.getDate() + 1)
    expirationDate = now
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

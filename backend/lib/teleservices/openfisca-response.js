import openfisca from "../openfisca/index.js"

function OpenFiscaResponse(simulation) {
  this.situation = simulation.getSituation()
}

OpenFiscaResponse.prototype.toInternal = function () {
  return [
    {
      formattedValue:
        "l’intégralité des informations saisies et des résultats obtenus.",
      label: "Votre simulation",
    },
  ]
}

OpenFiscaResponse.prototype.toExternal = function () {
  const p = new Promise((resolve, reject) => {
    openfisca.calculate(this.situation, (err, result) => {
      const additions = {
        _id: this.situationId,
        external_id: this.situation.external_id,
      }
      if (err) {
        return reject(Object.assign(err, additions))
      }

      resolve(Object.assign(result, additions))
    })
  })
  return p
}

export default OpenFiscaResponse

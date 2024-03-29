import openfisca from "../openfisca/index.js"

function OpenFiscaResponse(simulation) {
  this.situation = simulation.getSituation()
}

OpenFiscaResponse.prototype.toInternal = function () {
  return [
    {
      label: "Votre simulation",
      formattedValue:
        "l’intégralité des informations saisies et des résultats obtenus.",
    },
  ]
}

OpenFiscaResponse.prototype.toExternal = function () {
  const p = new Promise((resolve, reject) => {
    openfisca.calculate(this.situation, (err, result) => {
      const additions = {
        _id: this.simulationId,
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

var openfisca = require("../openfisca")

function OpenFiscaResponse(situation) {
  this.situation = situation
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
        _id: this.situation._id,
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

module.exports = OpenFiscaResponse

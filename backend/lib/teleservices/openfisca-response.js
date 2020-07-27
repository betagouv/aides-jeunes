var openfisca = require('../openfisca')

function OpenFiscaResponse(situation) {
    this.situation = situation
}

OpenFiscaResponse.prototype.toInternal = function() {
    return [{
      label: 'Votre simulation',
      formattedValue: 'l’intégralité des informations saisies.'
    }]
}

OpenFiscaResponse.prototype.toExternal = function() {
    const p = new Promise((resolve, reject) => {
        openfisca.calculate(this.situation, (err, result) => {
          if (err) {
            return reject(Object.assign(err, { _id: this.situation._id }))
          }

          resolve(Object.assign(result, { _id: this.situation._id }))
        })
    })
    return p
}

module.exports = OpenFiscaResponse

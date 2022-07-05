const openfisca = require("../openfisca")

function AidesJeunesServiceLogement(simulation) {
  this.simulation = simulation
}

AidesJeunesServiceLogement.prototype.toInternal = function () {
  return {}
}

AidesJeunesServiceLogement.prototype.toExternal = function ({ query }) {
  const props = query._
  if (!props.length) {
    return []
  }

  const inputs = query[props[0]]
  scenarios = inputs.map((v, i) => {
    return props.reduce((a, v) => {
      a[v] = query[v][i]
      return a
    }, {})
  })

  try {
    this.simulation.answers.current = this.simulation.answers.all

    var loyer = this.simulation.answers.current.find(
      (e) => e.fieldName == "loyer"
    )
    loyer.value.loyer = scenarios[0].loyer || loyer.value.loyer

    var depcom = this.simulation.answers.current.find(
      (e) => e.fieldName == "depcom"
    )
    depcom.value.depcom = scenarios[0].depcom || depcom.value.depcom

    return this.simulation.compute().then((r) => {
      return r.droitsEligibles.find((e) => e.slug == "aide_logement")?.montant
    })
  } catch (e) {
    return e.toString()
  }
}

module.exports = AidesJeunesServiceLogement

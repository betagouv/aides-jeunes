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
  const scenarios = inputs.map((v, i) => {
    return props.reduce((a, v) => {
      a[v] = query[v][i]
      return a
    }, {})
  })

  this.simulation.answers.current = this.simulation.answers.all

  const loyer = this.simulation.answers.current.find(
    (e) => e.fieldName == "loyer"
  )
  loyer.value.loyer = scenarios[0].loyer || loyer.value.loyer

  const depcom = this.simulation.answers.current.find(
    (e) => e.fieldName == "depcom"
  )
  depcom.value.depcom = scenarios[0].depcom || depcom.value.depcom

  return this.simulation
    .compute()
    .then((r) => {
      return {
        value: r.droitsEligibles.find((e) => e.slug == "aide_logement")
          ?.montant,
      }
    })
    .catch((error) => {
      return { error: error?.message, data: error?.response?.data }
    })
}

export default AidesJeunesServiceLogement

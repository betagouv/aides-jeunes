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

  const setters = {
    coloc: {
      value: (a) => a.value,
      set: (a, v) => (a.value = v === "true"),
      new: (v) => v === "true",
    },
    depcom: {
      value: (a) => a.value.depcom,
      set: (a, v) => (a.value.depcom = v),
    },
    logement_chambre: {
      value: (a) => a.value,
      set: (a, v) => (a.value = v === "true"),
      new: (v) => v === "true",
    },
    loyer: {
      value: (a) => a.value.loyer,
      set: (a, v) => (a.value.loyer = v),
      new: (v) => ({ loyer: v }),
    },
    default: {
      value: (a) => a.value,
      set: (a, v) => (a.value = v),
      new: (v) => v,
    },
  }

  props.forEach((prop) => {
    const fct = setters[prop] || setters.default
    const answer = this.simulation.answers.current.find(
      (e) => e.fieldName == prop
    )
    if (answer) {
      fct.set(answer, scenarios[0][prop] || fct.value(answer))
    } else {
      this.simulation.answers.current.push({
        entityName: "menage",
        fieldName: prop,
        value: fct.new(scenarios[0][prop]),
      })
    }
  })

  return this.simulation
    .compute()
    .then((r) => {
      return {
        value:
          r.droitsEligibles.find((e) => e.slug == "aide_logement")?.montant ||
          0,
      }
    })
    .catch((error) => {
      return { error: error?.message, data: error?.response?.data }
    })
}

export default AidesJeunesServiceLogement

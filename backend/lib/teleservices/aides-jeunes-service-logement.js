function AidesJeunesServiceLogement(simulation) {
  this.situation = simulation.getSituation()
}

AidesJeunesServiceLogement.prototype.toInternal = function () {
  return {}
}

AidesJeunesServiceLogement.prototype.toExternal = function ({ query }) {
  const props = query._
  if (!props.length) {
    return []
  }

  const scenarios = query[props[0]]
  return scenarios.map((v, i) => {
    return props.reduce((a, v) => {
      a[v] = query[v][i]
      return a
    }, {})
  })
}

module.exports = AidesJeunesServiceLogement

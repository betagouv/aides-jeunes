function DemarchesSimplifiees(simulation) {
  this.simulation = simulation
}

DemarchesSimplifiees.prototype.toInternal = function () {
  return this.simulation.answers.current.map((item) => {
    return {
      label: item.fieldName || item.entityName,
      value: JSON.stringify(item.value),
    }
  })
}

DemarchesSimplifiees.prototype.toExternal = function () {
  this.simulation.dateDeValeur.toISOString()
  const text = `Parce que c'est l'heure (de la simulation ${this.simulation.dateDeValeur
    .toISOString()
    .slice(0, -5)})`
  const number = Math.round(Math.random() * 100).toString()
  const boolean = Math.random() > 0.5 ? "true" : "false"
  const options = Math.random() > 0.5 ? "fromage" : "dessert"
  return {
    "champ_Q2hhbXAtMzAxNjg5Ng==": text,
    "champ_Q2hhbXAtMzAxNjg5OA==": number,
    "champ_Q2hhbXAtMzAxNjg5OQ==": boolean,
    "champ_Q2hhbXAtMzAxNjkwMA==": options,
  }
}

export default DemarchesSimplifiees

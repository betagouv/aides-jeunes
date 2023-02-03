function DemarchesSimplifiees(simulation) {
  this.simulation = simulation
}

function generateData(simulation) {
  const situation = `J'ai ${"xx"} ans et je suis ${"yy"}`
  return {
    // civilité
    "champ_Q2hhbXAtMzAzNDI4NA==": Math.random() > 0.5 ? "Mme" : "M.",

    // pays
    "champ_Q2hhbXAtMzAzNDM0Mg==": "FR",
    // région
    "champ_Q2hhbXAtMzAzNDM0MA==": "75",

    // date de naissance
    "champ_Q2hhbXAtMzAzNDM5Mw==": "2000-01-01",

    // déclaration fiscale
    "champ_Q2hhbXAtMzAzNDM5NQ==": "true",

    // activité
    "champ_Q2hhbXAtMzAzNDM5Ng==": "Actif occupé",

    // bafa
    "champ_Q2hhbXAtMzAzNDM5Nw==": "true",

    // dernier salaire
    "champ_Q2hhbXAtMzAzNDQ2Ng==": "33.10",

    // nb enfants
    "champ_Q2hhbXAtMzAzNDUxNw==": "0",

    // situation
    "champ_Q2hhbXAtMzAzNDY0MA==": situation,

    // email
    "champ_Q2hhbXAtMzAzNDQwMw==": "thomas@yolo.com",

    // téléphone
    "champ_Q2hhbXAtMzAzNDQwNQ==": "0612345678",

    // date de la simulation
    "champ_Q2hhbXAtMzAzNDM5NA==": simulation.dateDeValeur
      .toISOString()
      .slice(0, -8),
  }
}

DemarchesSimplifiees.prototype.toInternal = function () {
  const data = generateData(this.simulation)
  const keys = Object.keys(data)
  return keys.map((label) => {
    return {
      label,
      value: data[label],
    }
  })
}

DemarchesSimplifiees.prototype.toExternal = function () {
  return generateData(this.simulation)
}

export default DemarchesSimplifiees

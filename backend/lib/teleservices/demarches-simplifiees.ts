import axios from "axios"

const sources = {
  civilite: () => (Math.random() > 0.5 ? "Mme" : "M."),
  pays: () => "FR",
  region: () => "75",
  date_naissance: () => "2000-01-01",
  propre_declaration_fiscale: () => "true", // via enfant_a_charge
  activite: () => "Actif occupé",
  bafa: () => "true",
  dernier_salaire: () => "33.10",
  nb_enfants: () => "0",
  situation: () => `J'ai ${"xx"} ans et je suis ${"yy"}`,
  email: () => "thomas@yolo.com",
  telephone: () => "0612345678",
  date_de_valeur: (simulation) => {
    return simulation.dateDeValeur.toISOString().slice(0, -8)
  },
}

const mappings = {
  "aide-beaumont-en-verdunois": {
    "champ_Q2hhbXAtMzAzNDI4NA==": sources.civilite,
    "champ_Q2hhbXAtMzAzNDM0Mg==": sources.pays,
    "champ_Q2hhbXAtMzAzNDM0MA==": sources.region,
    "champ_Q2hhbXAtMzAzNDM5Mw==": sources.date_naissance,
    "champ_Q2hhbXAtMzAzNDM5NQ==": sources.propre_declaration_fiscale,
    "champ_Q2hhbXAtMzAzNDM5Ng==": sources.activite,
    "champ_Q2hhbXAtMzAzNDM5Nw==": sources.bafa,
    "champ_Q2hhbXAtMzAzNDQ2Ng==": sources.dernier_salaire,
    "champ_Q2hhbXAtMzAzNDUxNw==": sources.nb_enfants,
    "champ_Q2hhbXAtMzAzNDY0MA==": sources.situation,
    "champ_Q2hhbXAtMzAzNDQwMw==": sources.email,
    "champ_Q2hhbXAtMzAzNDQwNQ==": sources.telephone,
    "champ_Q2hhbXAtMzAzNDM5NA==": sources.date_de_valeur,
  },
}

function DemarchesSimplifiees(simulation, query) {
  this.simulation = simulation
  this.query = query
}

async function getMetaData(procedure) {
  const url = `https://www.demarches-simplifiees.fr/preremplir/${procedure}/schema`
  const response = await axios.get(url)
  return response.data
}

function generateData(simulation, benefit) {
  const mapping = mappings[benefit] || {}
  const fields = Object.keys(mapping)
  const values = fields.reduce((a, v) => {
    a[v] = mapping[v](simulation)
    return a
  }, {})
  return values
}

DemarchesSimplifiees.prototype.toInternal = async function () {
  const data = generateData(this.simulation, this.query.benefit)
  const meta = await getMetaData(this.query.benefit)

  const fieldLabelMap = meta.revision.champDescriptors.reduce((a, v) => {
    a[v.id] = v.label
    return a
  }, {})

  const keys = Object.keys(data)
  return keys.map((fieldId) => {
    const labelKey = fieldId.slice("champ_".length)
    return {
      label: fieldLabelMap[labelKey],
      value: data[fieldId],
    }
  })
}

DemarchesSimplifiees.prototype.toExternal = async function () {
  const meta = await getMetaData(this.query.benefit)
  return {
    teleservice: {
      id: meta.number,
      slug: this.query.benefit,
    },
    data: generateData(this.simulation, this.query.benefit),
  }
}

export default DemarchesSimplifiees

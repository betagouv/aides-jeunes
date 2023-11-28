import axios from "axios"
import dayjs from "dayjs"
import { getAnswer } from "../../../lib/answers.js"

const sources = {
  activite: () => "Actif occupé",
  adresse: () => "35 Rue Saint-Dominique 75007 Paris",
  annee_etude: () => (Math.random() > 0.5 ? "Seconde" : "Première"),
  bafa: () => "true",
  civilite: () => (Math.random() > 0.5 ? "Mme" : "M."),
  commune: (simulation) => {
    const depcom = getAnswer(simulation.answers.current, "menage", "depcom")
    return depcom && [depcom._codePostal, depcom.depcom]
  },
  date_de_valeur: (simulation) => {
    return dayjs(simulation.dateDeValeur).format("YYYY-MM-DDTHH:mm")
  },
  date_naissance: (simulation, id = "demandeur") => {
    const dob = getAnswer(
      simulation.answers.current,
      "individu",
      "date_naissance",
      id
    )
    if (!dob) {
      return
    }

    return new Date(dob).toISOString().slice(0, 10)
  },
  departement: (simulation) => {
    const depcom = getAnswer(simulation.answers.current, "menage", "depcom")
    return depcom?._departement
  },
  dernier_salaire: () => "33.10",
  email: () => "thomas@yolo.com",
  epci: (simulation) => {
    const depcom = getAnswer(simulation.answers.current, "menage", "depcom")
    return depcom && [depcom._departement, depcom._epci]
  },
  nb_enfants: (simulation) => simulation.enfants.length.toString(),
  pays: () => "FR",
  propre_declaration_fiscale: () => "true", // via enfant_a_charge
  region: (simulation) => {
    const depcom = getAnswer(simulation.answers.current, "menage", "depcom")
    return depcom?._region
  },
  situation: () => `J'ai ${"xx"} ans et je suis ${"yy"}`,
  situation_familliale: (simulation) => {
    const en_couple =
      getAnswer(simulation.answers.current, "famille", "en_couple") === true

    console.log("en couple: ", en_couple)
    if (en_couple) {
      const statut_marital = getAnswer(
        simulation.answers.current,
        "individu",
        "statut_marital",
        "conjoint"
      )
      console.log("statut_marital: ", statut_marital)
      // - Answer "en_couple" value "Union libre" is "celibataire" and needs to be restored as "Union libre" for the prefill
      // - Missing not available answers in the simulator : Veuf(ve), Séparé(e), Divorcé(e)
      const situations_couple = {
        marie: "Marié(e)",
        pacse: "Pacsé(e)",
        celibataire: "Union libre",
      }
      console.log(
        "situations_couple[statut_marital]: ",
        situations_couple[statut_marital]
      )
      return situations_couple[statut_marital]
    }
    return "Célibataire"
  },
  telephone: () => "0612345678",
}

const fsl_var_sources = {
  activite: (simulation) => {
    const activite = getAnswer(
      simulation.answers.current,
      "individu",
      "activite",
      "demandeur"
    )
    console.log("activite", activite)
    return activite
  },
  loyer_avec_charges: (simulation) => {
    const { loyer, charges_locatives } = getAnswer(
      simulation.answers.current,
      "menage",
      "loyer"
    )
    return loyer + charges_locatives
  },
  commune_nom: (simulation) => {
    const { _nomCommune } = getAnswer(
      simulation.answers.current,
      "menage",
      "depcom"
    )
    return _nomCommune
  },
}

function enfants_beaumount(simulation) {
  const mapping = {
    "champ_Q2hhbXAtMzAzNDUxOQ==": sources.date_naissance,
    "champ_Q2hhbXAtMzAzNDUyMA==": sources.annee_etude,
  }
  const fields = Object.keys(mapping)
  return simulation.enfants.map((e) => {
    const enfantId = `enfant_${e}`
    return fields.reduce((a, v) => {
      a[v] = mapping[v](simulation, enfantId)
      return a
    }, {})
  })
  return []
}

const mappings = {
  "aide-beaumont-en-verdunois": {
    "champ_Q2hhbXAtMzAzNDI4NA==": sources.civilite,
    "champ_Q2hhbXAtMzAzNDI4NQ==": sources.adresse,
    "champ_Q2hhbXAtMzAzNDI4Ng==": sources.commune,
    "champ_Q2hhbXAtMzAzNDI4Nw==": sources.departement,
    "champ_Q2hhbXAtMzAzNDM0MA==": sources.region,
    "champ_Q2hhbXAtMzAzNDM0MQ==": sources.epci,
    "champ_Q2hhbXAtMzAzNDM0Mg==": sources.pays,
    "champ_Q2hhbXAtMzAzNDM5Mw==": sources.date_naissance,
    "champ_Q2hhbXAtMzAzNDM5NA==": sources.date_de_valeur,
    "champ_Q2hhbXAtMzAzNDM5NQ==": sources.propre_declaration_fiscale,
    "champ_Q2hhbXAtMzAzNDM5Ng==": sources.activite,
    "champ_Q2hhbXAtMzAzNDY0MA==": sources.situation,
    "champ_Q2hhbXAtMzAzNDM5Nw==": sources.bafa,
    "champ_Q2hhbXAtMzAzNDQwMw==": sources.email,
    "champ_Q2hhbXAtMzAzNDQwNQ==": sources.telephone,
    "champ_Q2hhbXAtMzAzNDQ2Ng==": sources.dernier_salaire,
    "champ_Q2hhbXAtMzAzNDUxNw==": sources.nb_enfants,
    "champ_Q2hhbXAtMzAzNDUxOA==": enfants_beaumount,
  },
  "cd53-bafa": {
    champ_Q2hhbXAtMzc2NDE0: sources.date_naissance,
  },
  cd53_dat_bafd: {
    champ_Q2hhbXAtMzc2NDE0: sources.date_naissance,
  },
  cd53_sdem_vae: {
    "champ_Q2hhbXAtMjMyMjc1NA==": sources.date_naissance,
    "champ_Q2hhbXAtMjMyMjc2OQ==": sources.departement,
  },
  r28_dja: {
    "champ_Q2hhbXAtMzE5MDUwOQ==": sources.date_naissance,
    "champ_Q2hhbXAtMzE5MDU4Ng==": sources.commune,
  },
  "abonnement-aeea-dgitm": {
    "champ_Q2hhbXAtMzM3MjU3MQ==": sources.date_naissance,
  },
  "departement-83-demande-fonds-solidarite-energie": {
    "champ_Q2hhbXAtMjYwMzg1MA==": sources.date_naissance,
    "champ_Q2hhbXAtMjYxNzA3Ng==": fsl_var_sources.commune_nom,
    "champ_Q2hhbXAtMjU2NzM2Nw==": fsl_var_sources.loyer_avec_charges,
    "champ_Q2hhbXAtMjYwMzczMA==": fsl_var_sources.activite,
    champ_Q2hhbXAtMjAyODY4: sources.situation_familliale,
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
  const data = generateData(this.simulation, this.query.procedure)
  const meta = await getMetaData(this.query.procedure)

  const fieldLabelMap = meta.revision.champDescriptors.reduce((a, v) => {
    a[v.id] = v.label
    return a
  }, {})
  console.log("fieldLabelMap", fieldLabelMap)

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
  const meta = await getMetaData(this.query.procedure)
  return {
    teleservice: {
      id: meta.number,
      slug: this.query.procedure,
    },
    data: generateData(this.simulation, this.query.procedure),
  }
}

export default DemarchesSimplifiees

const aidesVelo = require("aides-velo")
const benefits = aidesVelo()

function generate_benefit_list(institutions) {
  const potentialInstitutions = {
    région: institutions.filter((i) => i.type === "region"),
    département: institutions.filter((i) => i.type === "departement"),
    epci: institutions.filter((i) => i.type === "epci"),
    "code insee": institutions.filter((i) => i.type === "commune"),
  }

  benefits.forEach((b) => {
    switch (b.collectivity.kind) {
      case "pays": {
        if (b.collectivity.value === "France") {
          b.institution = "etat"
        } else {
          b.discard = true
        }
        break
      }
      case "région":
      case "département":
      case "code insee": {
        const institutionList = potentialInstitutions[b.collectivity.kind]
        b.institution = institutionList.find(
          (i) => i.code_insee === b.collectivity.value
        )?.slug
        break
      }
      case "epci": {
        const institutionList = potentialInstitutions[b.collectivity.kind]
        b.institution = institutionList.find(
          (i) => i.code_siren === b.collectivity.code
        )?.slug
        break
      }
    }
  })

  return benefits
    .filter((b) => !b.discard)
    .map((b) => {
      return {
        label: `Aide à l'achat d'un vélo : ${b.title}`,
        description: b.description || `Aide à l'achat d'un vélo : ${b.title}`,
        id: `aidesvelo_${b.id}`.replace(/[ .']+/g, "_"),
        external_id: b.id,
        collectivity: b.collectivity,
        title: b.title,
        institution: b.institution,
        type: "float",
        periodicite: "ponctuelle",
        link: b.url,
      }
    })
}

module.exports = generate_benefit_list

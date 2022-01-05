const aidesVelo = require("aides-velo")

const benefits = aidesVelo.benefits || require("./aides-velo-mock")

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
        }
        break
      }
      case "région":
      case "département":
      case "code insee": {
        const institutionList = potentialInstitutions[b.collectivity.kind]
        b.institution = institutionList.find(
          (r) => r.publicId === b.collectivity.value
        )
        break
      }
      case "epci": {
        break
      }
    }
  })

  return benefits.map((b) => {
    const newId =
      b.id ||
      `${b.collectivity.kind}-${b.collectivity.value}-aides-velo`.replace(
        " ",
        "-"
      )

    return {
      label: "Aide à l'achat d'un vélo : " + b.title,
      description: b.description || "Aide à l'achat d'un vélo : " + b.title,
      id: newId,
      title: b.title,
      institution: b.institution,
      type: "float",
      periodicite: "ponctuelle",
      montant: 1,
      link: "https://mock",
    }
  })
}

module.exports = generate_benefit_list

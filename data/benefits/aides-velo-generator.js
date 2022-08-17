import aidesVelo from "aides-velo"

const benefits = [...aidesVelo()]

function generate_benefit_list(institutions) {
  const potentialInstitutions = {
    "code insee": institutions.filter((i) => i.type === "commune"),
    département: institutions.filter((i) => i.type === "departement"),
    epci: institutions.filter((i) => i.type === "epci"),
    région: institutions.filter((i) => i.type === "region"),
  }

  benefits.forEach((b) => {
    switch (b?.collectivity?.kind) {
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
          (i) => i.code_insee === b?.collectivity?.value
        )?.slug
        break
      }
      case "epci": {
        const institutionList = potentialInstitutions[b.collectivity.kind]
        b.institution = institutionList.find(
          (i) => i.code_siren === b?.collectivity?.code
        )?.slug
        break
      }
    }
  })

  return benefits
    .filter((b) => !b.discard)
    .map((b) => {
      const description =
        b?.description && !b.description.match(/((\s\$)+|(^\$)+)\w+/)
          ? b.description
          : `Aide à l'achat d'un vélo : ${b.title}`
      return {
        collectivity: b.collectivity,
        description: description,
        external_id: b.id,
        id: `aidesvelo_${b.id}`.replace(/[ .']+/g, "_"),
        institution: b.institution,
        label: `Aide à l'achat d'un vélo : ${b.title}`,
        link: b.url,
        periodicite: "ponctuelle",
        prefix: "l'",
        title: b.title,
        type: "float",
      }
    })
}

export default generate_benefit_list

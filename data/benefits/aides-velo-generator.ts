import { AidesVeloEngine } from "@betagouv/aides-velo"
import { VeloBenefit } from "../../data/types/benefits.d.js"
import { Institution } from "../../data/types/institutions.d.js"

const benefits = new AidesVeloEngine().getAllAidesIn("france")

function generate_benefit_list(
  institutions: Institution[]
): Omit<VeloBenefit, "amount">[] {
  const potentialInstitutions = {
    région: institutions.filter((i) => i.type === "region"),
    département: institutions.filter((i) => i.type === "departement"),
    epci: institutions.filter((i) => i.type === "epci"),
    "code insee": institutions.filter((i) => i.type === "commune"),
  }

  const get_institution = (
    b: Omit<VeloBenefit, "amount">
  ): string | undefined => {
    if (b.collectivity) {
      switch (b.collectivity.kind) {
        case "pays":
          return "etat"
        case "région":
        case "département":
        case "code insee": {
          return potentialInstitutions[b.collectivity.kind].find(
            (i) => i.code_insee === b.collectivity.value
          )?.slug
        }
        case "epci": {
          return potentialInstitutions[b.collectivity.kind].find(
            (i) => i.code_siren === b.collectivity.code
          )?.slug
        }
      }
    }
  }

  return benefits.map((b) => {
    const description =
      b.description && !b.description.match(/((\s\$)+|(^\$)+)\w+/)
        ? b.description
        : `Aide à l'achat d'un vélo : ${b.title}`

    return {
      // NOTE: maybe not the best way to avoid type errors.
      ...b,
      label: `Aide à l'achat d'un vélo : ${b.title}`,
      description,
      id: `aidesvelo_${b.id}`.replace(/[ .']+/g, "_"),
      external_id: b.id,
      collectivity: b.collectivity,
      title: b.title,
      institution: get_institution(b),
      prefix: "l'",
      type: "float",
      periodicite: "ponctuelle",
      link: b.url,
      interestFlag: "_interetsAidesVelo",
    }
  })
}

export default generate_benefit_list

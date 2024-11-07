import { AidesVeloEngine } from "@betagouv/aides-velo"
import { VeloBenefit, AidesVeloBenefit } from "../../data/types/benefits.d.js"
import {
  Institution,
  InstitutionsByType,
} from "../../data/types/institutions.d.js"

const aidesVeloEngine = new AidesVeloEngine()
const aidesVelo: AidesVeloBenefit[] = aidesVeloEngine.getAllAidesIn()

const VELO_BENEFIT_DEFAULT_VALUES = {
  prefix: "l'",
  type: "float",
  periodicite: "ponctuelle",
  interestFlag: "_interetsAidesVelo",
}

function filterInstitutionsByType(
  institutions: Institution[]
): InstitutionsByType {
  return {
    région: institutions.filter((i) => i.type === "region"),
    département: institutions.filter((i) => i.type === "departement"),
    epci: institutions.filter((i) => i.type === "epci"),
    "code insee": institutions.filter((i) => i.type === "commune"),
  }
}

function findAidesVeloBenefitMatchingInstitution(
  benefit: AidesVeloBenefit,
  institutionsByType: InstitutionsByType
): string | undefined {
  const { collectivity } = benefit
  if (!collectivity) return undefined

  if (collectivity.kind === "pays") return "etat"

  const institutions = institutionsByType[collectivity.kind]
  if (!institutions) return undefined

  const matchingInstitution = institutions.find((institution) => {
    if (collectivity.kind === "epci") {
      return institution.code_siren === collectivity.code
    }
    return institution.code_insee === collectivity.value
  })

  return matchingInstitution?.slug
}

function formatAidesVeloBenefitDescription(benefit: AidesVeloBenefit): string {
  const hasValidDescription =
    benefit.description && !benefit.description.match(/((\s\$)+|(^\$)+)\w+/)
  return (
    (hasValidDescription && benefit.description) ||
    `Aide à l'achat d'un vélo : ${benefit.title}`
  )
}

function formatAidesVeloToVeloBenefit(
  benefit: AidesVeloBenefit,
  institutionsByType: InstitutionsByType
): VeloBenefit {
  return {
    ...benefit,
    ...VELO_BENEFIT_DEFAULT_VALUES,
    label: `Aide à l'achat d'un vélo : ${benefit.title}`,
    description: formatAidesVeloBenefitDescription(benefit),
    id: `aidesvelo_${benefit.id}`.replace(/[ .']+/g, "_"),
    external_id: benefit.id,
    collectivity: benefit.collectivity,
    title: benefit.title,
    link: benefit.url,
    institution: findAidesVeloBenefitMatchingInstitution(
      benefit,
      institutionsByType
    ),
  }
}

export default function generateVeloBenefitList(
  institutions: Institution[]
): VeloBenefit[] {
  const institutionsByType = filterInstitutionsByType(institutions)
  return aidesVelo.map((benefit: AidesVeloBenefit) =>
    formatAidesVeloToVeloBenefit(benefit, institutionsByType)
  )
}

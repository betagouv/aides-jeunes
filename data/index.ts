import { additionalBenefitAttributes } from "./benefits/additional-attributes/index.js"
import aidesVeloGenerator from "./benefits/aides-velo-generator.js"
import { buildFSL } from "./benefits/dynamic/fsl.js"
import { buildAPA } from "./benefits/dynamic/apa.js"

import { Jamstack } from "./types/jamstack.d.js"
import {
  InstitutionRaw,
  Institution,
  InstitutionsMap,
} from "./types/institutions.d.js"
import { StandardBenefit, BenefitsMap } from "./types/benefits.d.js"
import { BenefitCatalog } from "./types/generator.d.js"

function generateInstitutionId(institution: InstitutionRaw) {
  return `${institution.type}_${
    institution.code_insee || institution.code_siren || institution.slug
  }`
}

function generateBenefitId(benefit: StandardBenefit) {
  return benefit.id || benefit.slug
}

function transformInstitutions(collection: InstitutionRaw[]): InstitutionsMap {
  return collection.reduce((result, data) => {
    const item = {
      slug: data.slug,
      id: generateInstitutionId(data),
      code_siren: data.code_siren,
      code_insee: data.code_insee,
      label: data.name,
      imgSrc: data.imgSrc,
      departments: data.departments,
      benefitsIds: [],
      type: data.type,
      top: data.top,
      repository:
        data.repository || (data.type === "national" ? null : "france-local"),
      lieuxTypes: data.lieuxTypes,
    }
    result[data.slug] = item
    return result
  }, {})
}

function setTop(benefit: StandardBenefit, institution: InstitutionRaw) {
  const default_top =
    institution.top ||
    (institution.type === "national"
      ? 3
      : benefit.source == "aides-velo"
      ? 13
      : 14)

  return benefit.top || default_top
}

function setDefaults(
  benefit: StandardBenefit,
  institution: Institution
): StandardBenefit {
  benefit.id = generateBenefitId(benefit)
  benefit.top = setTop(benefit, institution)
  benefit.floorAt = benefit.floorAt || 1
  return benefit
}

export function generate(
  collections: Jamstack["collections"],
  additionalBenefitAttributes,
  aidesVeloBenefitListGenerator?: typeof aidesVeloGenerator,
  fslGenerator?: typeof buildFSL,
  apaGenerator?: typeof buildAPA
): BenefitCatalog {
  const institutions = transformInstitutions(collections.institutions.items)
  collections.benefits_javascript.items.forEach((benefit) => {
    benefit.source = "javascript"
  })
  collections.benefits_openfisca.items.forEach((benefit) => {
    benefit.source = "openfisca"
  })

  const aidesVeloBenefits = aidesVeloBenefitListGenerator
    ? aidesVeloBenefitListGenerator(Object.values(institutions))
    : []
  aidesVeloBenefits.forEach((benefit) => {
    benefit.source = "aides-velo"
  })

  const fslBenefits = fslGenerator ? fslGenerator() : []
  const apaBenefits = apaGenerator ? apaGenerator() : []

  const benefitsCollections = [
    ...collections.benefits_javascript.items,
    ...collections.benefits_openfisca.items,
    ...aidesVeloBenefits.filter((b) => b.institution),
    ...apaBenefits,
    ...fslBenefits,
  ]
  const benefitsMap: BenefitsMap = {}

  const benefits: StandardBenefit[] = benefitsCollections.map((benefit) => {
    const institution: Institution = institutions[benefit.institution]
    benefit = setDefaults(benefit, institution)
    Object.assign(benefit, additionalBenefitAttributes[benefit.id])
    institution.benefitsIds.push(benefit.id)
    benefit.institution = institution
    benefitsMap[benefit.id] = benefit
    return benefit
  })

  const result = {
    all: benefits,
    institutionsMap: institutions,
    benefitsMap: benefitsMap,
  }

  return result
}

export default {
  generateInstitutionId,
  generateBenefitId,
  fn: generate,
  generate: (jam: Jamstack) =>
    generate(
      jam.collections,
      additionalBenefitAttributes,
      aidesVeloGenerator,
      buildFSL,
      buildAPA
    ),
}

"use strict"

import { additionalBenefitAttributes } from "./benefits/additional-attributes/index.js"
import aidesVeloGenerator from "./benefits/aides-velo-generator.js"

function transformInstitutions(collection: any[]) {
  return collection.reduce((result, data) => {
    const item = {
      benefitsIds: [],
      code_insee: data.code_insee,
      code_siren: data.code_siren,
      etablissements: data.etablissements,
      id: `${data.type}_${data.code_insee || data.code_siren || data.slug}`,
      imgSrc: data.imgSrc,
      label: data.name,
      repository:
        data.repository || (data.type === "national" ? null : "france-local"),
      slug: data.slug,
      top: data.top,
      type: data.type,
    }
    result[data.slug] = item
    return result
  }, {})
}

function setTop(benefit, institution) {
  const default_top =
    institution.top ||
    (institution.type === "national"
      ? 3
      : benefit.source == "aides-velo"
      ? 13
      : 14)

  return benefit.top || default_top
}

function setDefaults(benefit, institution) {
  benefit.id = benefit.id || benefit.slug
  benefit.top = setTop(benefit, institution)
  benefit.floorAt = benefit.floorAt || 1
  return benefit
}

export function generate(
  collections,
  additionalBenefitAttributes,
  aidesVeloBenefitListGenerator
) {
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

  let benefits = [
    ...collections.benefits_javascript.items,
    ...collections.benefits_openfisca.items,
    ...aidesVeloBenefits.filter((b) => b.institution),
  ].map((benefit) => {
    return Object.assign({}, benefit, additionalBenefitAttributes[benefit.slug])
  })

  const benefitsMap = {}

  benefits = benefits.map((benefit) => {
    const institution = institutions[benefit.institution]
    benefit = setDefaults(benefit, institution)
    institution.benefitsIds.push(benefit.id)
    benefit.institution = institution
    benefitsMap[benefit.id] = benefit
    return benefit
  })

  const result = {
    all: benefits,
    benefitsMap: benefitsMap,
    institutionsMap: institutions,
  }

  return result
}

export default {
  fn: generate,
  generate: (jam) =>
    generate(jam.collections, additionalBenefitAttributes, aidesVeloGenerator),
}

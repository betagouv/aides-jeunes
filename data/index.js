"use strict"

const additionalBenefitAttributes = require("./benefits/additional-attributes")
const aidesVeloGenerator = require("./benefits/aides-velo-generator")

function transformInstitutions(collection) {
  return collection.reduce((result, data) => {
    const item = {
      slug: data.slug,
      id: `${data.type}_${data.code_insee || data.code_siren || data.slug}`,
      code_siren: data.code_siren,
      code_insee: data.code_insee,
      label: data.name,
      imgSrc: data.imgSrc,
      benefitsIds: [],
      type: data.type,
      top: data.top,
      repository:
        data.repository || (data.type === "national" ? null : "france-local"),
      etablissements: data.etablissements,
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

function generate(
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
    institutionsMap: institutions,
    benefitsMap: benefitsMap,
  }

  return result
}

module.exports = {
  fn: generate,
  generate: (jam) =>
    generate(jam.collections, additionalBenefitAttributes, aidesVeloGenerator),
}

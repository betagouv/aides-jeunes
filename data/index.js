"use strict"

const additionalBenefitAttributes = require("./benefits/additional-attributes")
const aidesVeloGenerator = require("./benefits/aides-velo-generator")

function transformInstitutions(collection) {
  return collection.reduce((result, data) => {
    const item = {
      slug: data.slug,
      id: data.id || data.slug,
      label: data.name,
      imgSrc: data.imgSrc?.slice("img/".length),
      benefitsIds: [],
      type: data.type,
      repository:
        data.repository || (data.type === "national" ? null : "france-local"),
      etablissements: data.etablissements,
    }
    result[data.slug] = item
    return result
  }, {})
}

function setDefaults(benefit, institution) {
  const top = institution.type === "national" ? 1 : 5

  benefit.id = benefit.id || benefit.slug
  benefit.top = benefit.top || top
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
    benefit.top = 8
  })

  const benefits = [
    ...collections.benefits_javascript.items,
    ...collections.benefits_openfisca.items,
    ...aidesVeloBenefits.filter((b) => b.institution),
  ].map((benefit) => {
    return Object.assign({}, benefit, additionalBenefitAttributes[benefit.slug])
  })

  const benefitsMap = {}

  benefits.forEach((benefit) => {
    const institution = institutions[benefit.institution]
    benefit = setDefaults(benefit, institution)
    institution.benefitsIds.push(benefit.id)
    benefit.institution = institution
    benefitsMap[benefit.id] = benefit
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

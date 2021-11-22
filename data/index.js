"use strict"

const customBenefits = require("./custom-benefits/index")

function transformInstitutions(collection) {
  return collection.reduce((result, data) => {
    const item = {
      id: data.slug,
      label: data.name,
      imgSrc: data.imgSrc && data.imgSrc.slice("img/".length),
      prestations: {},
      national: data.national,
      level: data.national ? "prestationsNationales" : "partenairesLocaux",
      repository: data.repository || (data.national ? null : "france-local"),
      etablissements: data.etablissements,
    }
    result[data.slug] = item
    return result
  }, {})
}

function setDefaults(benefit, national) {
  const top = national ? 1 : 5

  benefit.id = benefit.slug
  benefit.top = benefit.top || top
  benefit.floorAt = benefit.floorAt || 1
  return benefit
}

function generate(collections, customBenefits) {
  const institutions = transformInstitutions(collections.institutions.items)

  collections.benefits_javascript.items.forEach((benefit) => {
    benefit.computesLocally = true
  })

  const benefits = [
    ...collections.benefits_javascript.items,
    ...collections.benefits_openfisca.items,
    ...customBenefits,
  ]

  benefits.forEach((benefit) => {
    const institution = institutions[benefit.institution]
    benefit = setDefaults(benefit, institution.national)
    institution.prestations[benefit.slug] = { ...benefit }
    benefit.institution = institution
  })

  const result = {
    all: benefits,
    groupByInstitution: institutions,
  }

  return result
}

module.exports = {
  fn: generate,
  generate: (jam) => generate(jam.collections, customBenefits),
}

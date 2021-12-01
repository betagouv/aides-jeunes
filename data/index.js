"use strict"

const customBenefits = require("./custom-benefits/index")

const LEVELS = ["prestationsNationales", "partenairesLocaux"]

function transformInstitutions(collection) {
  return collection.reduce((result, data) => {
    const item = {
      label: data.name,
      imgSrc: data.imgSrc && data.imgSrc.slice("img/".length),
      prestations: {},
      national: data.national,
      repository: data.repository || (data.national ? null : "france-local"),
      etablissements: data.etablissements,
    }
    result[data.slug] = item
    return result
  }, {})
}

/**
 * This function iterates over the nested benefits, and executes a callback.
 * The callback is called with 4 parameters:
 * - benefit: the benefit object
 * - benefitId: the benefit id
 * - provider: the benefit provider id
 * - providerId: the benefit provider id
 */
function forEachFactory(obj) {
  return function forEach(cb) {
    LEVELS.map((aidesProviderLevel) => {
      let aidesProviders = obj[aidesProviderLevel]
      Object.keys(aidesProviders).map((aidesProviderId) => {
        let aidesProvider = aidesProviders[aidesProviderId]
        Object.keys(aidesProvider.prestations).map((aideId) => {
          let aide = aidesProvider.prestations[aideId]
          cb(aide, aideId, aidesProvider, aidesProviderId, aidesProviderLevel)
        })
      })
    })
  }
}

function setDefaults(benefit, top) {
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
    institution.prestations[benefit.slug] = setDefaults(
      benefit,
      institution.national ? 1 : 5
    )
  })

  const result = {
    prestationsNationales: {},
    partenairesLocaux: {},
  }
  Object.entries(institutions).forEach(([institutionId, institution]) => {
    const level = institution.national
      ? "prestationsNationales"
      : "partenairesLocaux"
    result[level][institutionId] = institution
  })

  result.forEach = forEachFactory(result)
  return result
}

module.exports = {
  fn: generate,
  generate: (jam) => generate(jam.collections, customBenefits),
}

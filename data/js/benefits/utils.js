function processBenefits(result, data) {
  const item = {
    label: data.name,
    imgSrc: data.imgSrc && data.imgSrc.slice("img/".length),
    prestations: [],
    national: data.national,
    repository: data.repository || (data.national ? null : "france-local"),
  }
  result[data.slug] = item
  return result
}

function transformInstitutions(collection) {
  return {
    national: collection.filter((i) => i.national).reduce(processBenefits, {}),
    /* eslint-disable */
    local: collection.filter((i) => !i.national).reduce(processBenefits, {}),
  }
}

function append(institutions, benefits) {
  const remaining = []

  benefits.forEach((benefit) => {
    const institution = institutions[benefit.institution]
    /* eslint-disable */
    if (!institution) {
      remaining.push(benefit)
      return
    }
    institution.prestations[benefit.slug] = benefit
  })

  return remaining
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
    const levels = ["prestationsNationales", "partenairesLocaux"]
    levels.map((aidesProviderLevel) => {
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
}

const topLevels = {
  prestationsNationales: 1,
  partenairesLocaux: 5,
}

function generate(collections, base) {
  const fileBasedInstitutions = transformInstitutions(
    collections.institutions.items
  )

  const localInstitutions = {
    ...base.partenairesLocaux,
    ...fileBasedInstitutions.local,
  }
  const nationalInstitutions = {
    ...base.prestationsNationales,
    ...fileBasedInstitutions.national,
  }

  const fileBasedBenefits = collections.benefits.items
  const notLocalTextBasedBenefits = append(localInstitutions, fileBasedBenefits)
  const remainingBenefits = append(
    nationalInstitutions,
    notLocalTextBasedBenefits
  )

  if (remainingBenefits.length) {
    throw `Some benefits cannot be processed, their related entity is missing (${remainingBenefits
      .map((b) => b.institution)
      .join(", ")}).`
  }

  const result = {
    prestationsNationales: nationalInstitutions,
    partenairesLocaux: localInstitutions,
  }

  const levels = ["prestationsNationales", "partenairesLocaux"]
  levels.forEach(function (levelId) {
    Object.keys(result[levelId]).forEach(function (providerId) {
      Object.keys(result[levelId][providerId].prestations).forEach(function (
        benefitId
      ) {
        const benefit = result[levelId][providerId].prestations[benefitId]
        setDefaults(benefit, topLevels[levelId])
      })
    })
  })

  result.forEach = forEachFactory(result)
  return result
}

module.exports = {
  generate,
}

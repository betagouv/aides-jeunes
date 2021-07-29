function generateTestingBenefits(slug, list) {
  const items = list.map((item, index) => {
    const description =
      "Ceci est une aide de test, une première étape à la contribution. Elle <strong>n'est affichée que</strong> pour les bénéficiaires du RSA."
    const value = {
      label: `${item.name} 🥁`,
      description,
      link: item.link,
      type: "bool",
      test: true,
    }
    return { [`${slug}_${index}`]: value }
  })
  return Object.assign({}, ...items)
}

function transformInstitutions(collection) {
  const processBenefits = (result, data) => {
    const item = {
      label: data.name,
      imgSrc: data.imgSrc && data.imgSrc.slice("img/".length),
      prestations: generateTestingBenefits(
        data.slug,
        data.testing_benefits || []
      ),
      national: data.national,
      repository: data.repository || data.national ? 'france' : 'france-local',
    }
    result[data.slug] = item
    return result
  }

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

function extractExperimentations(institutions) {
  return Object.keys(institutions)
    .filter((pid) => {
      const benefits = institutions[pid].prestations
      return Object.keys(benefits).filter((id) => benefits[id].test).length
    })
    .map((pid) => {
      let provider = institutions[pid]
      return {
        ...provider,
        prestations: Object.keys(provider.prestations)
          .filter((id) => provider.prestations[id].test)
          .reduce((accum, id) => {
            accum[id] = provider.prestations[id]
            return accum
          }, {}),
      }
    })
}

function setDefaults(benefit, top) {
  benefit.top = benefit.top || top
  benefit.floorAt = benefit.floorAt || 1
  benefit.entity = benefit.entity || "familles"
}

var topLevels = {
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
  result.experimentations = extractExperimentations(result.partenairesLocaux)

  const levels = ["prestationsNationales", "partenairesLocaux"]
  levels.forEach(function (levelId) {
    Object.keys(result[levelId]).forEach(function (providerId) {
      Object.keys(result[levelId][providerId].prestations).forEach(function (
        benefitId
      ) {
        var benefit = result[levelId][providerId].prestations[benefitId]
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

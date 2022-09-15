import { additionalBenefitAttributes } from "./benefits/additional-attributes/index.js"
import aidesVeloGenerator from "./benefits/aides-velo-generator.js"
import { build } from "./benefits/dynamic/fsl.js"

function generateInstitutionId(institution) {
  return `${institution.type}_${
    institution.code_insee || institution.code_siren || institution.slug
  }`
}

function generateBenefitId(benefit) {
  return benefit.id || benefit.slug
}

function generateInstitutionData(collection: any[]) {
  return collection.reduce((result, data) => {
    const item = {
      slug: data.slug,
      id: generateInstitutionId(data),
      code_siren: data.code_siren,
      code_insee: data.code_insee,
      label: data.name,
      imgSrc: data.imgSrc,
      department: data.department,
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

function formatBenefitCollection(benefitCollection, institutions) {
  benefitCollection.map((benefit) => {
    benefit.id = generateBenefitId(benefit)
    benefit.top = setTop(benefit, institutions[benefit.institution])
    benefit.floorAt = benefit.floorAt || 1
    return benefit
  })

  return benefitCollection
}
const generateBenefitCollection = function (
  staticBenefitCollection,
  institutions,
  activeBenefits
) {
  const benefitCollection = [
    ...staticBenefitCollection.benefits_javascript.items,
    ...staticBenefitCollection.benefits_openfisca.items,
  ]

  staticBenefitCollection.benefits_javascript.items.forEach((benefit) => {
    benefit.source = "javascript"
  })
  staticBenefitCollection.benefits_openfisca.items.forEach((benefit) => {
    benefit.source = "openfisca"
  })

  if (activeBenefits.fsl === true) {
    benefitCollection.push(...build(institutions))
  }
  if (activeBenefits.aidesVelo === true) {
    const aidesVeloBenefits = aidesVeloGenerator(Object.values(institutions))
    aidesVeloBenefits.map((benefit) => {
      benefit.source = "aides-velo"
    })
    benefitCollection.push(...activeBenefits)
  }
  benefitCollection.map((benefit) => {
    return Object.assign(benefit, additionalBenefitAttributes[benefit.slug])
  })

  return benefitCollection
}
export function generate(
  staticBenefitCollection,
  activeBenefits = {
    fsl: false,
    aidesVelo: false,
  }
) {
  const institutions = generateInstitutionData(
    staticBenefitCollection.institutions.items
  )

  let benefitCollection = generateBenefitCollection(
    staticBenefitCollection,
    institutions,
    activeBenefits
  )

  benefitCollection = formatBenefitCollection(benefitCollection, institutions)

  benefitCollection.forEach((benefit) => {
    const institution = institutions[benefit.institution]
    institution.benefitsIds.push(benefit.id)
  })

  const benefitsMap = {}
  benefitCollection.forEach((benefit) => {
    benefitsMap[benefit.id] = benefit
  })

  return {
    all: benefitCollection,
    institutionsMap: institutions,
    benefitsMap: benefitsMap,
  }
}

export default {
  generateInstitutionId,
  generateBenefitId,
  fn: generate,
  generate: (jam, activeBenefits) => {
    return generate(jam.collections, activeBenefits)
  },
}

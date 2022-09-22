import { additionalBenefitAttributes } from "./benefits/additional-attributes/index.js"
import aidesVeloGenerator from "./benefits/aides-velo-generator.js"
import { build as buildFSL } from "./benefits/dynamic/fsl.js"
import { benefitVeloLayout } from "./types/benefits"

function generateInstitutionId(institution) {
  return `${institution.type}_${
    institution.code_insee || institution.code_siren || institution.slug
  }`
}

function generateBenefitId(benefit) {
  return benefit.id || benefit.slug
}

function generateFullInstitutionData(collection: any[]) {
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

function generateFullBenefitData(benefitCollection, institutions) {
  benefitCollection.map((benefit) => {
    benefit.id = generateBenefitId(benefit)
    benefit.top = setTop(benefit, institutions[benefit.institution])
    benefit.floorAt = benefit.floorAt || 1
    return benefit
  })

  return benefitCollection
}

const mergeBenefits = function (
  staticBenefitCollection,
  activeDynamicBenefitGenerators,
  dynamicBenefitAttributes,
  institutions
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

  if (activeDynamicBenefitGenerators.fsl === true) {
    benefitCollection.push(...buildFSL(institutions))
  }
  if (activeDynamicBenefitGenerators.aidesVelo === true) {
    const aidesVeloBenefits = aidesVeloGenerator(Object.values(institutions))
    aidesVeloBenefits.map((benefit: benefitVeloLayout) => {
      benefit.source = "aides-velo"
    })
    benefitCollection.push(...aidesVeloBenefits)
  }
  benefitCollection.map((benefit) => {
    return Object.assign(benefit, dynamicBenefitAttributes[benefit.slug])
  })

  return benefitCollection
}
const addRelationToData = function (institutions, benefitCollection) {
  benefitCollection.forEach((benefit) => {
    const institution = institutions[benefit.institution]
    institution.benefitsIds.push(benefit.id)
    benefit.institution = institution
  })
}

export function generate(
  staticBenefitCollection,
  activeDynamicBenefitGenerators = {
    // permet de déterminer les infos à générer pour les tests unitaires
    fsl: true,
    aidesVelo: true,
  },
  dynamicBenefitAttributes = additionalBenefitAttributes
) {
  const institutions = generateFullInstitutionData(
    staticBenefitCollection.institutions.items
  )

  let benefitCollection = mergeBenefits(
    staticBenefitCollection,
    activeDynamicBenefitGenerators,
    dynamicBenefitAttributes,
    institutions
  )

  benefitCollection = generateFullBenefitData(benefitCollection, institutions)

  addRelationToData(institutions, benefitCollection)

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
  generate: (jam) => {
    return generate(jam.collections)
  },
}

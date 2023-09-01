import generator from "../data/all.js"
import { StandardBenefit } from "../data/types/benefits.d.js"
import { Institution } from "../data/types/institutions.d.js"

import { createRequire } from "module"
const require = createRequire(import.meta.url)
const epcis = require("@etalab/decoupage-administratif/data/epci.json")

interface RollupInstitutionInterface {
  id: string
  label: string
  type: string
  benefits: { label: string; id: string }[]
  location?: string | string[]
}

export interface RollupInstitutionMapInterface {
  national: RollupInstitutionInterface[]
  region: RollupInstitutionInterface[]
  departement: RollupInstitutionInterface[]
  epci: RollupInstitutionInterface[]
  caf: RollupInstitutionInterface[]
  msa: RollupInstitutionInterface[]
  commune: RollupInstitutionInterface[]
  autre: RollupInstitutionInterface[]
}

const institutionsBenefits = {}

for (const benefit of Object.values(
  generator.benefitsMap
) as StandardBenefit[]) {
  if (benefit.private) {
    continue
  }
  const institution = benefit.institution.slug
  if (!institutionsBenefits[institution]) {
    institutionsBenefits[institution] = []
  }
  institutionsBenefits[institution].push({
    label: benefit.label,
    id: benefit.id,
  })
}

const institutions: RollupInstitutionMapInterface = {
  national: [],
  region: [],
  departement: [],
  epci: [],
  caf: [],
  msa: [],
  commune: [],
  autre: [],
}

for (const id in generator.institutionsMap) {
  const institution: Institution = generator.institutionsMap[id]

  // Institution has no attached benefit
  if (!institutionsBenefits[institution.slug]) {
    continue
  }
  const institutionObject: RollupInstitutionInterface = {
    id: institution.slug,
    label: institution.label,
    type: institution.type,
    benefits: institutionsBenefits[institution.slug],
  }
  if (institution.type === "epci") {
    institutionObject.location =
      epcis
        .find((element) => element.code === institution.code_siren)
        ?.membres.map((commune) => commune.code) || []
  } else if (["caf", "msa"].includes(institution.type)) {
    institutionObject.location = institution.departments
  } else if (["region", "departement", "commune"].includes(institution.type)) {
    institutionObject.location = institution.code_insee
  }
  if (!institutions[institution.type]) {
    const msg = `The new institution type '${institution.type}' of '${institution.slug}' needs to be added in rollup/institutions.ts`
    console.error(msg)
    throw new Error(msg)
  }
  institutions[institution.type].push(institutionObject)
}

export default institutions

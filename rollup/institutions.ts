import generator from "../data/all.js"

import { createRequire } from "module"
const require = createRequire(import.meta.url)
const epcis = require("@etalab/decoupage-administratif/data/epci.json")

const institutionsBenefits = {}

for (const benefit in generator.benefitsMap) {
  if (generator.benefitsMap[benefit].private) {
    continue
  }
  const institution = generator.benefitsMap[benefit].institution.slug
  if (!institutionsBenefits[institution]) {
    institutionsBenefits[institution] = []
  }
  institutionsBenefits[institution].push({
    label: generator.benefitsMap[benefit].label,
    id: generator.benefitsMap[benefit].id,
  })
}

const institutions = {
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
  const institution = generator.institutionsMap[id]

  // Institution has no attached benefit
  if (!institutionsBenefits[institution.slug]) {
    continue
  }
  const institutionObject = {
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
    console.log(institution)
    const msg = `The new institution type '${institution.type}' of '${institution.slug}' needs to be added in rollup/institutions.ts`
    console.error(msg)
    throw new Error(msg)
  }
  institutions[institution.type].push(institutionObject)
}

export default institutions

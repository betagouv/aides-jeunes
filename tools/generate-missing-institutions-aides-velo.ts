// @ts-ignore
import generator from "../data/benefits/aides-velo-generator.js"
import benefits from "../data/all.js"
import { missingInstitutionsVeloBenefit } from "./generate-missing-institutions.js"

const list = generator(Object.values(benefits.institutionsMap))

const missingInstitutionBenefits = list.filter((b) => !b.institution)

missingInstitutionsVeloBenefit(missingInstitutionBenefits)

// @ts-ignore
import generator from "../data/benefits/aides-velo-generator"
import benefits from "../data/all"
import { missingInstitutionsVeloBenefit } from "./generate-missing-institutions"

const list = generator(Object.values(benefits.institutionsMap))

const missingInstitutionBenefits = list.filter((b) => !b.institution)

missingInstitutionsVeloBenefit(missingInstitutionBenefits)

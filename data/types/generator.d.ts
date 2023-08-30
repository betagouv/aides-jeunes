import { InstitutionsMap } from "./institutions.d.js"
import { StandardBenefit, BenefitsMap } from "./benefits.d.js"

export interface IDataGenerator {
  all: StandardBenefit[]
  institutionsMap: InstitutionsMap
  benefitsMap: BenefitsMap
}

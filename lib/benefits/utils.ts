import { StandardBenefit } from "@data/types/benefits.d.js"

export function isOpenfiscaBenefit(benefit: StandardBenefit): boolean {
  return benefit.source === "openfisca" || benefit.source === "reform_dynamic"
}

export function isSimpleBenefit(benefit: StandardBenefit): boolean {
  return benefit.source === "javascript" || benefit.source === "reform_dynamic"
}

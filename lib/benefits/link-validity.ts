import { benefitData } from "../types/link-validity.js"

export function process(existingWarnings, checkResult: benefitData): number {
  if (existingWarnings) {
    if (existingWarnings[checkResult.id]) {
      return []
    }
  }
  return [{}]
}

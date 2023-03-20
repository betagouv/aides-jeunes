import BenefitsCategories from "@/lib/benefits-categories.js"
import { Benefit } from "@lib/types/benefits.js"
import Benefits from "generator:benefits"

export function getBenefit(benefitId: number): number[] {
  return Benefits[benefitId]
}

export const mockResults = function (sublist: string) {
  let filterSublist: string[] | null

  if (sublist) {
    filterSublist = BenefitsCategories[sublist] || sublist.split(",")
  } else {
    filterSublist = null
  }

  const defaults = {
    bool: true,
    float: 1,
  }

  let benefits: Benefit[] = []

  if (filterSublist) {
    benefits = filterSublist
      .map((benefit) => Benefits[benefit])
      .filter((benefit: string) => benefit)
  } else {
    benefits = Object.keys(Benefits)
      .map((benefit) => Benefits[benefit])
      .filter((benefit: string) => benefit)
  }

  const list: Benefit[] = benefits.map((benefit) => {
    return Object.assign({}, benefit, {
      montant: benefit.montant || defaults[benefit.type || "float"],
      mock: true,
    })
  })

  return {
    droitsEligibles: list,
    droitsInjectes: [],
  }
}

export default Object.keys(Benefits).map((benefit) => Benefits[benefit])

import BenefitsCategories from "@/lib/benefits-categories.js"
import { benefitLayout } from "@data/types/benefits.d.js"
import Benefits from "generator:benefits"

export function getBenefit(benefitId: number): number[] {
  return Benefits[benefitId]
}

export const mockResults = function (sublist: string) {
  let filterSublist: string[] | null = []
  if (sublist) {
    filterSublist = BenefitsCategories[sublist] || sublist.split(",")
  } else {
    filterSublist
  }

  const defaults = {
    bool: true,
    float: 1,
  }

  let benefits: benefitLayout[] = []

  if (filterSublist) {
    benefits = filterSublist
      .map((benefit) => Benefits[benefit])
      .filter((benefit: string) => benefit)
  } else {
    benefits = Object.keys(Benefits)
      .map((benefit) => Benefits[benefit])
      .filter((benefit: string) => benefit)
  }

  const list: benefitLayout[] = benefits.map((benefit) => {
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

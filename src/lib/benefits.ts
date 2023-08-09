import { benefitLayout, StandardBenefit } from "@data/types/benefits.d.js"
import Benefits from "generator:benefits"

export function getBenefit(benefitId: string): StandardBenefit {
  return Benefits[benefitId]
}

export const mockResults = function (sublist: string) {
  const defaults = {
    bool: true,
    float: 1,
  }

  const filterSublist: string[] | null = sublist ? sublist.split(",") : null

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

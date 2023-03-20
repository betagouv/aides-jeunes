import BenefitsCategories from "@/lib/benefits-categories.js"
import Benefits from "generator:benefits"

export function getBenefit(benefitId) {
  return Benefits[benefitId]
}

export const mockResults = function (sublist) {
  let filterSublist
  if (sublist) {
    filterSublist = BenefitsCategories[sublist] || sublist.split(",")
  }

  const defaults = {
    bool: true,
    float: 1,
  }

  let benefits = []
  if (filterSublist) {
    benefits = filterSublist
      .map((benefit) => Benefits[benefit])
      .filter((benefit) => benefit)
  } else {
    benefits = Object.keys(Benefits)
      .map((benefit) => Benefits[benefit])
      .filter((benefit) => benefit)
  }

  const list = benefits.map((benefit) => {
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

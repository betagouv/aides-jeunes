import BenefitsCategories from "@/lib/benefits-categories"
import institutionsBenefits from "generator:benefits"

export function getBenefit(benefitId) {
  return institutionsBenefits[benefitId]
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
    benefits = filterSublist.map((benefit) => institutionsBenefits[benefit])
  } else {
    benefits = Object.keys(institutionsBenefits).map(
      (benefit) => institutionsBenefits[benefit]
    )
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

export default {}

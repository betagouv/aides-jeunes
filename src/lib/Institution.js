import BenefitsCategories from "@/lib/BenefitsCategories"
const benefits = require("../../data/all.js")

const Institution = {}

Institution.mockResults = function (sublist) {
  let filterSublist
  if (sublist) {
    filterSublist = BenefitsCategories[sublist] || sublist.split(",")
  }

  const defaults = {
    bool: true,
    float: 1,
  }

  const list = benefits.all
    .filter((benefit) => !filterSublist || filterSublist.includes(benefit.id))
    .map((benefit) => {
      return Object.assign({}, benefit, {
        montant: benefit.montant || defaults[benefit.type || "float"],
        provider: benefit.institution,
        providerId: benefit.institution.id,
        mock: true,
      })
    })

  return {
    droitsEligibles: list,
    droitsNonEligibles: [],
    droitsInjectes: [],
  }
}

export default Institution

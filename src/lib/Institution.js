import BenefitsCategories from "@/lib/BenefitsCategories"
import jamstack from "jamstack-loader!../../contribuer/public/admin/config.yml"
import { generate } from "@/../data"

const Institution = {
  benefits: generate(jamstack),
}

Institution.mockResults = function (sublist) {
  let filterSublist
  if (sublist) {
    filterSublist = BenefitsCategories[sublist] || sublist.split(",")
  }

  const defaults = {
    bool: true,
    float: 1,
  }

  const list = Institution.benefits.all
    .filter((benefit) => !filterSublist || filterSublist.includes(benefit.id))
    .map((benefit) => {
      return Object.assign({}, benefit, {
        montant: benefit.montant || defaults[benefit.type || "float"],
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

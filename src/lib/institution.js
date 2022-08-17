//import x from "../../data/**/*.yml"
import BenefitsCategories from "@/lib/benefits-categories"
import collections from "@data/collections.json"

const contentModules = import.meta.glob("../../data/**/*.{yml,yaml}", {
  eager: true,
})
console.log(contentModules)

import data from "@data"
import jamstack from "jamstack-loader!../../contribuer/public/admin/config.yml"
console.log(jamstack)
const Institution = {
  benefits: collections,
  mockResults(sublist) {
    let filterSublist
    if (sublist) {
      filterSublist = BenefitsCategories[sublist] || sublist.split(",")
    }

    const defaults = {
      bool: true,
      float: 1,
    }

    const list = this.benefits.all
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
  },
}

export default Institution

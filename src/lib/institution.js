import BenefitsCategories from "@/lib/benefits-categories"
//import jamstack from "jamstack-loader!../../contribuer/public/admin/config.yml"
import jamstackLoader from "jamstack-loader"
const jamstack = jamstackLoader.get("../../contribuer/public/admin/config.yml")
import data from "@data"

const Institution = {
  benefits: data.generate(jamstack),
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

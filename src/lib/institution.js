import BenefitsCategories from "@/lib/benefits-categories"
//import jamstack from "jamstack-loader!../../contribuer/public/admin/config.yml"
//import jamstackLoader from "../../node_modules/jamstack-loader/src/index.js"
//const jamstackD = jamstackLoader.get("../../contribuer/public/admin/config.yml")

const jamstack = {
  institutions: {
    items: [],
  },
  benefits_javascript: {
    items: [],
  },
  benefits_openfisca: {
    items: [],
  },
  all: [],
}

//import data from "@data/index.js"
import data from "@data/all.js"

const Institution = {
  benefits: [], //data, //data.generate(jamstack),
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

import jamstack from "jamstack-loader!../../contribuer/public/admin/config.yml"
import * as droitsDescription from "@/../app/js/constants/benefits"
import BenefitsCategories from "@/lib/BenefitsCategories"

const Institution = droitsDescription.generate(jamstack)
Institution.forEachBenefit = Institution.forEach

Institution.mockResults = function (sublist) {
  let filterSublist
  if (sublist) {
    filterSublist = BenefitsCategories[sublist] || sublist.split(",")
  }
  const list = []

  const defaults = {
    bool: true,
    float: 1,
  }

  Institution.forEachBenefit((aide, aideId, aidesProvider, aidesProviderId) => {
    const addition = Object.assign({}, aide, {
      id: aideId,
      montant: defaults[aide.type || "float"],
      provider: aidesProvider,
      providerId: aidesProviderId,
      mock: true,
    })

    if (!filterSublist || filterSublist.includes(aideId)) {
      list.push(addition)
    }
  })

  return {
    droitsEligibles: list,
    droitsNonEligibles: [],
    droitsInjectes: [],
  }
}

export default Institution

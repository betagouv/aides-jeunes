import BenefitsCategories from "@/lib/benefits-categories"
import data from "@data"
import * as config from "../../contribuer/public/admin/config.yml"

const collectionsData = {
  institutions: import.meta.glob("../../data/institutions/*.{yml,yaml}", {
    eager: true,
    import: "default",
  }),
  benefits_javascript: import.meta.glob(
    "../../data/benefits/javascript/*.{yml,yaml}",
    {
      eager: true,
      import: "default",
    }
  ),
  benefits_openfisca: import.meta.glob(
    "../../data/benefits/openfisca/*.{yml,yaml}",
    {
      eager: true,
      import: "default",
    }
  ),
}

const slugPattern = /\/([0-9a-z\-_–·éèà’ëïô]*)\.ya?ml$/i
function pop(collection) {
  const items = []
  for (let key in collectionsData[collection.name]) {
    if (key.match(slugPattern)) {
      const slug = slugPattern.exec(key)[1]
      items.push({
        slug,
        ...collectionsData[collection.name][key],
      })
    } else {
      console.log("Failed to load file:", key)
    }
  }
  return {
    ...collection,
    items,
  }
}

let collections = config.collections.reduce((accum, collection) => {
  accum[collection.name] = pop(collection)
  return accum
}, {})

const Institution = {
  benefits: data.generate({ collections }),
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
      droitsInjectes: [],
    }
  },
}

export default Institution

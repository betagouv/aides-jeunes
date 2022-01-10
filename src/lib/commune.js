import axios from "axios"
import maxBy from "lodash/maxBy"

function sortByName(aCity, bCity) {
  if (aCity.nom < bCity.nom) return -1
  if (aCity.nom > bCity.nom) return 1

  return 0
}

const Commune = {
  get: function (postalCode) {
    const uri = `/api/outils/communes/${postalCode}`
    return axios
      .get(uri)
      .then((result) => {
        return result.data.sort(sortByName)
      })
      .catch(() => {
        return []
      })
  },
  getMostPopulated: function (communes) {
    return (
      maxBy(communes, "population") || (communes?.length && communes?.[0]) || {}
    )
  },
}

export default Commune

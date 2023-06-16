import axios from "axios"
import { CityParams } from "@lib/types/commune.js"

function sortByName(aCity: CityParams, bCity: CityParams): number {
  if (aCity.nom < bCity.nom) return -1
  if (aCity.nom > bCity.nom) return 1

  return 0
}

const Commune = {
  get: function (postalCode: number): Promise<string[]> {
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

  getMostPopulated: function (communes: CityParams[]) {
    return communes.reduce(
      (a, b) => ((a?.population || 0) < (b?.population || 0) ? b : a),
      communes?.[0] || {}
    )
  },
}

export default Commune

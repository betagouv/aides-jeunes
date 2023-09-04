import axios from "axios"
import { Commune } from "@lib/types/commune.d.js"

function sortByName(aCity: Commune, bCity: Commune): number {
  if (aCity.nom < bCity.nom) return -1
  if (aCity.nom > bCity.nom) return 1

  return 0
}

const CommuneMethods = {
  get: function (postalCode: string): Promise<Commune[]> {
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

  getMostPopulated: function (communes: Commune[]) {
    return communes.reduce(
      (a, b) => ((a?.population || 0) < (b?.population || 0) ? b : a),
      communes?.[0] || {}
    )
  },
}

export default CommuneMethods

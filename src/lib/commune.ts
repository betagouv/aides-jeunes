import axios from "axios"
import { CommuneInterface } from "@lib/types/commune.js"

function sortByName(aCity: CommuneInterface, bCity: CommuneInterface): number {
  if (aCity.nom < bCity.nom) return -1
  if (aCity.nom > bCity.nom) return 1

  return 0
}

const Commune = {
  get: function (postalCode: string): Promise<CommuneInterface[]> {
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

  getMostPopulated: function (communes: CommuneInterface[]) {
    return communes.reduce(
      (a, b) => ((a?.population || 0) < (b?.population || 0) ? b : a),
      communes?.[0] || {}
    )
  },
}

export default Commune

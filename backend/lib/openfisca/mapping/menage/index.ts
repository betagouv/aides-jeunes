import lodash from "lodash"
const cloneDeep = lodash.cloneDeep
import dayjs from "dayjs"

export function buildOpenFiscaMenage(situation) {
  const openFiscaMenage = cloneDeep(situation.menage)
  openFiscaMenage.date_entree_logement = dayjs(situation.dateDeValeur)
    .add(openFiscaMenage._nombreMoisEntreeLogement || 0, "month")
    .format("YYYY-MM-DD")
  return openFiscaMenage
}

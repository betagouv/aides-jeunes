import { cloneDeep } from "lodash-es"
import dayjs from "dayjs"

import { Menage } from "../../../../types/openfisca.js"

export function buildOpenFiscaMenage(situation): Menage {
  const openFiscaMenage = cloneDeep(situation.menage)
  openFiscaMenage.date_entree_logement = dayjs(situation.dateDeValeur)
    .add(openFiscaMenage._nombreMoisEntreeLogement || 0, "month")
    .format("YYYY-MM-DD")
  return openFiscaMenage
}

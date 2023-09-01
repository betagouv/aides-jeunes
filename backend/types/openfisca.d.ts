import { IndividuProperties } from "../../lib/types/individu.js"
import { situationsLayout } from "../../lib/types/situations.js"

export interface OpenfiscaMapping {
  individus: IndividuProperties[]
  familles?: Famille
  foyers_fiscaux: FoyersFiscaux
  menages: Menage
}

export interface Famille {
  _: any
  parents?: situationsLayout
}

export interface Menage {
  _: any
  parents?: any
}

export interface FoyersFiscaux {
  _: {
    declarants: string[]
    personnes_a_charge: IndividuProperties[]
    rfr?: any
  }
}

export interface OpenfiscaPeriods {
  today: string
  thisMonth: string
  thisYear: string
  oneMonthAgo: string
  twoMonthsAgo: string
  threeMonthsAgo: string
  twelveMonthsAgo: string
  last3Months: string[]
  last12Months: string[]
  lastYear: string
  fiscalYear: string
  fiscalYear12Months: string[]
  previousFiscalYear: string
  previousFiscalYear12Months: string[]
  threeYearsAgo: string
}

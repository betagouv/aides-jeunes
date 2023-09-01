import { Individu } from "../../lib/types/individu.js"
import { Situation } from "../../lib/types/situations.js"

export interface OpenfiscaMapping {
  individus: Individu[]
  familles?: Famille
  foyers_fiscaux: FoyersFiscaux
  menages: Menage
}

export interface Famille {
  _: any
  parents?: Situation
}

export interface Menage {
  _: any
  parents?: any
}

export interface FoyersFiscaux {
  _: {
    declarants: string[]
    personnes_a_charge: Individu[]
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

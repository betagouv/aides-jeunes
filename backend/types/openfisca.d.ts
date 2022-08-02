import { individuLayout } from "../../lib/types/individu"
import { situationsLayout } from "../../lib/types/situations"

export interface openfiscaMappingLayout {
  individus: individuLayout[]
  familles?: familleLayout
  foyers_fiscaux: foyersFiscauxLayout
  menages: menageLayout
}

export interface familleLayout {
  _: any
  parents?: situationsLayout
}

export interface menageLayout {
  _: any
  parents?: any
}

export interface foyersFiscauxLayout {
  _: {
    declarants: string[]
    personnes_a_charge: individuLayout[]
    rfr?: any
  }
}

export interface openfiscaPeriodsLayout {
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

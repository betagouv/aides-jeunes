import { Individu } from "../../lib/types/individu.js"
import { Situation } from "../../lib/types/situations.js"
import { BenefitExtra, StandardBenefit } from "../../data/types/benefits.js"

export interface OpenfiscaMapping {
  individus: Individu[]
  familles?: Famille
  foyers_fiscaux: FoyersFiscaux
  menages: Menage
}

export interface Famille {
  _: {
    parents: string[]
    enfants: string[]
    foyers_fiscaux: FoyersFiscaux
    [openfiscaBenefitId as string]: {
      [date as string]: number
    }
  }
  parents?: Situation
}

export interface Menage {
  _: any
  parents?: any
}

export interface FoyersFiscaux {
  _: {
    declarants: string[]
    personnes_a_charge: string[]
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

export interface OpenfiscaVariables {
  [id: string]: StandardBenefit | BenefitExtra
}

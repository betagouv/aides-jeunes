import { Institution } from "./institutions.d.js"

// extends "Aide" type defined in "aides-velo" package
type Aide = {
  title: string
  description: string
  url: string
  amount?: number
}

export interface Benefit {
  id: string
  label: string
  type?: string
  montant?: number
  mock?: boolean
}

export interface VeloBenefit extends Aide {
  id: string
  url?: string
  collectivity: {
    kind: string
    value: string
    code?: string
  }
  institution?: string

  discard?: boolean

  source?: string

  link?: string
  external_id?: string
  type?: string
  periodicite?: string
}

export interface CovoiturageBenefit {
  id: string
  institution: string
  source?: string
  periodicite?: string
  description: string
  label: string
  conditions: string[]
  conditions_generales: {
    type: string
    values?: string[]
  }[]
  prefix: string
  type: string
  link: string
}

export interface CovoiturageJson {
  link: string
  code_siren: string
  nom_plateforme: string
  operateurs: string
  zone_sens_des_trajets: string
  conducteur_montant_max_par_mois: number
  conducteur_montant_min_par_passager: number
  conducteur_montant_max_par_passager: number
  trajet_longueur_max: number
  trajet_longueur_min: number
  passager_trajets_max_par_mois: number
}

export interface JavascriptBenefit {
  name: string
  imgSrc?: string
  institution: string
  description: string
  prefix: string
  conditions: any[]
  voluntary_conditions?: string[]
  profils?: any[]
  conditions: string[]
  interestFlag?: string
  type: string
  unit?: string
  periodicite: string
  legend?: string
  montant?: number
  link: string
  teleservice?: string
  form?: string
  instructions?: string
  floorAt?: number
  top?: number
  private?: boolean
  participation: {
    type: string
    legend: string
  }
  source?: string
  teleservicePrefill?: string
}

export interface StandardBenefit {
  slug: string
  label: string
  institution: Institution
  description: string
  conditions: string[]
  link: string
  instructions: string
  prefix: string
  type: string
  unit: string
  periodicite: string
  legend: string | ((OpenfiscaParameters) => string)
  montant: number | string | boolean
  interestFlag: string
  conditions_generales: any
  profils: string[]
  form: string
  source: string
  id: string
  top: number
  floorAt: number
  teleservice: string
  private: boolean
  instructionsGenerator: (number) => string
  voluntary_conditions: any
  imgSrc?: string
  participation: boolean | any
  entity: string
  openfiscaPeriod: string
  isBaseRessourcesYearMinusTwo: boolean
  msa: boolean
  teleservices: any
  isBaseRessourcesPatrimoine: boolean
  computeUnexpectedAmount: (any) => boolean
  setToZeroRecently: boolean
  lieuxTypes: string[]
  openfisca_eligibility_source: string
  extra?: BenefitExtra[]
  compute: (any) => boolean
  labelFunction: (any) => string
  customization: any
  external_id: string
  collectivity: any
  title: string
  teleservicePrefill?: string
  showUnexpectedAmount?: boolean
  groupLabel?: string
}

export interface BenefitGroup {
  benefits: StandardBenefit[]
  id: string
  label: string
  logoPath: string
  description: string
  interestFlag: string
}

export interface BenefitWithChoice extends StandardBenefit {
  choiceValue: string | null
  choiceComments: string
  plansToAsk?: boolean
}

export interface BenefitExtra {
  id: string
  entity?: string
  type: string
  openfiscaPeriod: string
}

export interface BenefitsMap {
  [key: string]: StandardBenefit
}

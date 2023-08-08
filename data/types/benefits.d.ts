// extends "Aide" type defined in "aides-velo" package
type Aide = {
  title: string
  description: string
  url: string
  amount?: number
}

export interface benefitLayout {
  id: string
  label: string
  type?: string
  montant?: number
  mock?: boolean
}

export interface benefitVeloLayout extends Aide {
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

export interface JavascriptBenefitLayout {
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
  //id?: string
  source?: string
}

export interface StandardBenefit {
  slug: string
  label: string
  institution: InstitutionLayout
  description: string
  conditions: string[]
  link: string
  instructions: string
  prefix: string
  type: string
  unit: string
  periodicite: string
  legend: string | ((openfiscaParametersLayout) => string)
  montant: number
  interestFlag: string
  conditions_generales: any
  profils: string[]
  form: string
  source: string
  id: string
  top: number
  floorAt: number
  teleservice: string
  skip_schema_check: boolean
  private: boolean
  instructionsGenerator: (number) => string
  voluntary_conditions: any
  imgSrc: string
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
  extra: any[]
  compute: (any) => boolean
  labelFunction: (any) => string
  customization: any
  external_id: string
  collectivity: any
  title: string
}

export interface BenefitsMap {
  [key as string]: StandardBenefit
}

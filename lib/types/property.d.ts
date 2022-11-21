export interface PropertyData {
  openFiscaParameters?: any
  simulation?: any
  individu?: any
  periods?: any
}

export interface Step {
  entity: string
  id: string
  variable: string
  path: string
  key: string
  chapter?: string
  isActive?: boolean
}

export interface EnumItemProperty {
  label: string
  value: boolean | number | string
  hint?: string | any
  isRelevant?: (propertyData: PropertyData) => boolean
}

export interface PropertyConstruct {
  question: string | ((propertyData: PropertyData) => string)
  questionType?: string
  optional?: boolean
  help?: string
  moreInfo?: string | ((variation: any) => string)
  showMoreInfo?: boolean | ((propertyData: PropertyData) => boolean)
  getAnswerFormat?: (propertyData: PropertyData) => any
  recapHeader?: (propertyData: PropertyData) => any
}

export interface ItemPropertyConstruct extends PropertyConstruct {
  items:
    | EnumItemProperty[]
    | ((propertyData: PropertyData) => EnumItemProperty[])
}

export interface NumberPropertyConstruct extends PropertyConstruct {
  type?: string
  unit?: string
  min?: number
}

export interface RecapPropertyLine {
  rowClass?: string
  label: string
  value?: string
  labelClass?: string
  hideEdit?: boolean
  path?: string
}

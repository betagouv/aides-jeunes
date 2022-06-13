export interface PropertyData {
  openFiscaParameters?: any
  simulation?: any
  individu?: any
  periods?: any
}

export interface EnumItemProperty {
  label: string
  value: boolean | number | string
  isRelevant?: (propertyData: PropertyData) => boolean
}
